import { QdrantClient } from '@qdrant/js-client-rest';
import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

const client = new QdrantClient({ url: 'http://localhost:6333' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}

export async function ingestFile(filePath, collectionName) {
    console.log(`🧠 Unificando Memória: ${path.basename(filePath)} -> ${collectionName}`);
    const content = await fs.readFile(filePath, 'utf-8');

    // Chunking simples (500 tokens aprox)
    const chunks = content.match(/[\s\S]{1,2000}/g) || [];

    const points = [];
    for (const chunk of chunks) {
        const embedding = await getEmbedding(chunk);
        points.push({
            id: crypto.randomUUID(),
            vector: embedding,
            payload: {
                content: chunk,
                source: path.basename(filePath),
                path: filePath,
                timestamp: new Date().toISOString()
            }
        });
    }

    await client.upsert(collectionName, { points });
    console.log(`✅ ${points.length} fragmentos soldados na memória unificada.`);
}

if (process.argv[2]) {
    const file = process.argv[2];
    const collection = process.argv[3] || 'domain-code';
    ingestFile(file, collection).catch(console.error);
}
