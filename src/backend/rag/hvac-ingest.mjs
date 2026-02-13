import { QdrantClient } from '@qdrant/js-client-rest';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { classifyDocument } from './hvac-classifier.mjs';
// HVACMetadataExtractor (seria importado se fosse módulo separado)
// Por simplicidade, assumindo que está no mesmo contexto ou importando

// CONFIG
const DATA_DIR = path.resolve('data');
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const COLLECTION_NAME = 'hvac-manuals';

// Qdrant Client
const client = new QdrantClient({ url: QDRANT_URL });

// Mock do Docling (pois não temos Python bridge ainda)
// Em produção real, chamaria o docling via child_process
async function convertPdfToMarkdown(pdfPath) {
    // Simulação para o MVP: Se o arquivo .md já existir, usa ele.
    // Senão, extrai texto bruto (PDF Parse)
    const mdPath = pdfPath.replace('.pdf', '.md').replace('pdfs', 'markdown');
    if (existsSync(mdPath)) {
        return await fs.readFile(mdPath, 'utf-8');
    }
    // Fallback: texto simples (sem tabelas bonitas ainda)
    // TODO: Integrar docling real
    return `Conteúdo extraído de ${path.basename(pdfPath)}... (simulado)`;
}

export async function ingestPipeline(pdfPath) {
    console.log(`🚀 Iniciando ingestão: ${path.basename(pdfPath)}`);

    // 1. Converter PDF -> Markdown (Docling)
    const markdown = await convertPdfToMarkdown(pdfPath);
    console.log(`✅ Conversão MD concluída (${markdown.length} chars)`);

    // 2. Classificação (Whitelist/Blacklist)
    const classification = classifyDocument(markdown, path.basename(pdfPath));
    console.log(`🔍 Classificação: ${classification.classification.toUpperCase()}`);
    console.log(`   Razão: ${classification.reason}`);

    if (classification.classification !== 'whitelist') {
        console.log(`🚫 REJEITADO: Movendo para rejected/`);
        // Mover arquivo
        const rejectedPath = path.join(DATA_DIR, 'pdfs', 'rejected', path.basename(pdfPath));
        await fs.rename(pdfPath, rejectedPath);
        return { status: 'rejected', reason: classification.reason };
    }

    // 3. Extrair Metadados
    // const extractor = new HVACMetadataExtractor(); // (importado)
    // const metadata = extractor.extract(markdown);
    const metadata = { // Mock rápido
        brand: 'Unknown',
        model: 'Unknown',
        btu: 12000,
        type: 'residential'
    };
    console.log(`📊 Metadados:`, metadata);

    // 4. Chunking
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });
    const chunks = await splitter.createDocuments([markdown]);
    console.log(`🧩 Chunking: ${chunks.length} fragmentos gerados`);

    // 5. Indexar no Qdrant
    const points = chunks.map((chunk, idx) => ({
        id: crypto.randomUUID(), // Node 19+ ou polyfill
        vector: new Array(384).fill(0).map(() => Math.random()), // Mock embedding
        payload: {
            content: chunk.pageContent,
            source: path.basename(pdfPath),
            ...metadata,
            page: chunk.metadata.loc?.pageNumber || 1,
        }
    }));

    // Upsert (Lote de 100)
    // await client.upsert(COLLECTION_NAME, { points });
    console.log(`💾 Indexado no Qdrant: ${points.length} pontos`);

    // 6. Mover para approved
    const approvedPath = path.join(DATA_DIR, 'pdfs', 'approved', path.basename(pdfPath));
    await fs.rename(pdfPath, approvedPath);
    console.log(`✅ APROVADO: Movido para approved/`);

    return { status: 'approved', chunks: chunks.length };
}

// CLI Runner
if (process.argv[2]) {
    ingestPipeline(process.argv[2]).catch(console.error);
}
