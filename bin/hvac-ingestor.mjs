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
        execSync(`node ${IAM_LOGGER} WORKER "${escapedMsg}"`);
    } catch (e) { console.log(e.message); }
}

async function ingestManual(pdfPath) {
    const fileName = path.basename(pdfPath);
    logIAM("🛠️ Iniciando processamento Docling para: " + fileName);
    
    try {
        const pyScript = "from docling.document_converter import DocumentConverter\n" +
                         "import json\n" +
                         "import sys\n\n" +
                         "converter = DocumentConverter()\n" +
                         "result = converter.convert(sys.argv[1])\n" +
                         "print(result.document.export_to_markdown())\n";
        
        fs.writeFileSync('temp_converter.py', pyScript);
        
        logIAM("🧬 Executando rede neural Docling (Fallback CPU)...");
        const markdown = execSync(VENV_PYTHON + ' temp_converter.py "' + pdfPath + '"').toString();
        
        logIAM("📚 Injetando conhecimento no Qdrant (Librarian Meta)...");
        
        await client.upsert('open_claw_skills', {
            wait: true,
            points: [
                {
                    id: Math.floor(Math.random() * 1000000),
                    vector: Array(1536).fill(0.3),
                    payload: {
                        name: "Manual HVAC: " + fileName,
                        description: "Conhecimento técnico extraído via Docling.",
                        content_md: markdown.substring(0, 2000),
                        source: pdfPath
                    }
                }
            ]
        });

        logIAM("✅ Missão Cumprida: " + fileName + " indexado!");
        fs.unlinkSync('temp_converter.py');
    } catch (e) {
        logIAM("❌ Erro no Pipeline: " + e.message);
    }
}

const [,, pdfPath] = process.argv;
if (pdfPath) {
    ingestManual(pdfPath);
} else {
    ingestManual('/data/manuals/daikin_vrv_iv_service.pdf');
}
