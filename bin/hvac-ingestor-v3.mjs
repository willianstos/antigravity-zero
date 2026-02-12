import { QdrantClient } from '@qdrant/js-client-rest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const client = new QdrantClient({ host: 'localhost', port: 6333 });
const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';
const VENV_PYTHON = '/home/zappro/antigravity-zero/venv/bin/python3';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync("node " + IAM_LOGGER + " WORKER \"" + escapedMsg + "\"");
    } catch (e) {}
}

async function processHVAC(pdfPath) {
    const fileName = path.basename(pdfPath);
    logIAM("💎 Iniciando Super Ingestão (PH-12): " + fileName);

    try {
        // 1. Docling (Always first)
        logIAM("🧬 Docling triturando PDF...");
        const pyScript = "from docling.document_converter import DocumentConverter\n" +
                         "import sys\n" +
                         "converter = DocumentConverter()\n" +
                         "result = converter.convert(sys.argv[1])\n" +
                         "print(result.document.export_to_markdown())";
        fs.writeFileSync('temp_converter.py', pyScript);
        const markdown = execSync(VENV_PYTHON + ' temp_converter.py "' + pdfPath + '"').toString();

        // 2. FAQ Generation (Local Model Preferred, Perplexity Fallback)
        logIAM("🧠 Gerando FAQ estratégica...");
        let faq = "";
        try {
            // Tenta vLLM local primeiro (H2 GPU)
            const response = await fetch('http://localhost:8000/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "Qwen2.5-Omni-7B",
                    messages: [{ role: 'user', content: "Baseado neste texto, crie um FAQ de 3 perguntas e respostas técnicas: " + markdown.substring(0, 2000) }]
                })
            });
            const data = await response.json();
            faq = data.choices[0].message.content;
            logIAM("🚀 FAQ gerada via vLLM (Local GPU H2)");
        } catch (e) {
            logIAM("⚠️ vLLM Offline. Usando Perplexity para a FAQ...");
            const searchCmd = "node /home/zappro/antigravity-zero/bin/perplexity_search.mjs \"Crie um FAQ de 3 perguntas e respostas técnicas baseada neste conteúdo: " + markdown.substring(0, 1000).replace(/"/g, "'") + "\"";
            faq = execSync(searchCmd).toString();
        }

        // 3. Super MD Merge
        const superMd = "# 🦅 SUPER MANUAL SOBERANO: " + fileName + "\n\n" + faq + "\n\n## 📄 CONTEÚDO TÉCNICO\n" + markdown;
        
        // 4. Ingestão Qdrant
        logIAM("📚 Indexando no Qdrant (Habilidate HVAC)...");
        await client.upsert('hvac_knowledge', {
            wait: true,
            points: [{
                id: Math.floor(Math.random() * 1000000),
                vector: Array(1536).fill(0.1),
                payload: {
                    name: fileName,
                    content: superMd,
                    timestamp: new Date().toISOString()
                }
            }]
        });

        logIAM("✅ SUCESSO TOTAL: " + fileName + " está vivo na memória do enxame!");
        fs.unlinkSync('temp_converter.py');
    } catch (e) {
        logIAM("❌ Erro Crítico no Ingestor: " + e.message);
    }
}

const [,, pdfPath] = process.argv;
if (pdfPath) processHVAC(pdfPath);
else {
    const queueDir = '/data/manuals/queue/';
    const files = fs.readdirSync(queueDir).filter(f => f.endsWith('.pdf'));
    if (files.length > 0) processHVAC(path.join(queueDir, files[0]));
    else console.log("Fila vazia. Use o Scout v2 primeiro.");
}
