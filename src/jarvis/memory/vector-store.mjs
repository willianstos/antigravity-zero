// ================================================
// 🧠 VECTOR STORE — Qdrant Semantic Memory
// Stores and retrieves embeddings for long-term memory
// ================================================

import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '..', '..', '.env') });

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const COLLECTION_NAME = 'jarvis_memory';

class VectorStore {
    constructor() {
        this.ready = false;
    }

    async init() {
        console.log('🧠 [MEMORY] Coordinating Qdrant Vector Store...');
        try {
            // Check if collection exists, if not create it
            const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`);
            if (!res.ok) {
                console.log(`🧠 [MEMORY] Creating collection: ${COLLECTION_NAME}`);
                await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        vectors: {
                            size: 1536, // OpenAI text-embedding-3-small
                            distance: 'Cosine'
                        }
                    })
                });
            }
            this.ready = true;
            console.log('✅ [MEMORY] Vector Store ready');
        } catch (err) {
            console.error(`❌ [MEMORY] Qdrant Error: ${err.message}`);
        }
    }

    // Get embedding from OpenAI
    async getEmbedding(text) {
        if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not found');
        const res = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: text,
                model: 'text-embedding-3-small'
            })
        });
        const data = await res.json();
        return data.data[0].embedding;
    }

    // Store a piece of memory
    async store(text, metadata = {}) {
        if (!this.ready) await this.init();
        try {
            const vector = await this.getEmbedding(text);
            const payload = {
                text,
                timestamp: new Date().toISOString(),
                ...metadata
            };

            await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points?wait=true`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    points: [{
                        id: Date.now(), // Simplified ID
                        vector,
                        payload
                    }]
                })
            });
            return true;
        } catch (err) {
            console.error(`❌ [MEMORY] Store failed: ${err.message}`);
            return false;
        }
    }

    // Search for relevant memory
    async search(query, limit = 5) {
        if (!this.ready) await this.init();
        try {
            const vector = await this.getEmbedding(query);
            const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vector,
                    limit,
                    with_payload: true
                })
            });
            const data = await res.json();
            return data.result || [];
        } catch (err) {
            console.error(`❌ [MEMORY] Search failed: ${err.message}`);
            return [];
        }
    }
}

export default new VectorStore();
export { VectorStore };
