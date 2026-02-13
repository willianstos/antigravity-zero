import { QdrantClient } from '@qdrant/js-client-rest';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

const client = new QdrantClient({ host: 'localhost', port: 6333 });
const IAM_LOGGER = path.join(os.homedir(), 'antigravity-zero/bin/iam-logger.mjs');

function logIAM(msg) {
    try {
        execSync(`node ${IAM_LOGGER} WORKER "${msg}"`);
    } catch (e) {
        console.log(`[IAM Error] ${e.message}`);
    }
}

async function indexInitialSkills() {
    logIAM("🛠️ Iniciando indexação de habilidades base no Qdrant.");
    
    const skills = [
        {
            id: 1,
            name: "perplexity-search",
            description: "Busca oficial via Perplexity API para o Jarvis Sovereign.",
            vector: Array(1536).fill(0.1)
        },
        {
            id: 2,
            name: "skill_architect",
            description: "Cria novas ferramentas (skills) para o enxame e as registra na biblioteca Qdrant.",
            vector: Array(1536).fill(0.2)
        }
    ];

    try {
        await client.upsert('open_claw_skills', {
            wait: true,
            points: skills.map(s => ({
                id: s.id,
                vector: s.vector,
                payload: { name: s.name, description: s.description }
            }))
        });
        logIAM("✅ Sucesso: Habilidades base indexadas na biblioteca.");
    } catch (e) {
        logIAM(`❌ Erro ao indexar: ${e.message}`);
    }
}

indexInitialSkills();
