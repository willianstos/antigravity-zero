import { QdrantClient } from '@qdrant/js-client-rest';
import fs from 'fs';
import path from 'path';

const client = new QdrantClient({ host: 'localhost', port: 6333 });

async function syncDocs() {
    console.log("🚀 Sincronizando Persona e Regras no Qdrant...");
    
    const docs = [
        { name: "Constituição v7.0", path: "/home/zappro/.openclaw/instructions.md" },
        { name: "Identidade Sovereign", path: "/home/zappro/.openclaw/workspace/IDENTITY.md" },
        { name: "Política de Capacidade", path: "/home/zappro/antigravity-zero/.agent/rules/CAPACITY_POLICY.md" },
        { name: "Skills Handbook", path: "/home/zappro/.openclaw/workspace/SKILLS_HANDBOOK.md" }
    ];

    for (const doc of docs) {
        if (fs.existsSync(doc.path)) {
            const content = fs.readFileSync(doc.path, 'utf8');
            await client.upsert('swarm_toolbox', {
                wait: true,
                points: [{
                    id: Math.floor(Math.random() * 1000000),
                    vector: Array(1536).fill(0.1), // Mock vector para busca semântica básica
                    payload: {
                        name: doc.name,
                        content: content,
                        type: "core_rule",
                        timestamp: new Date().toISOString()
                    }
                }]
            });
            console.log("✅ Doc sincronizado: " + doc.name);
        }
    }
}

syncDocs().catch(console.error);
