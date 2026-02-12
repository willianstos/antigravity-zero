import { QdrantClient } from '@qdrant/js-client-rest';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

const client = new QdrantClient({ host: 'localhost', port: 6333 });
const IAM_LOGGER = path.join(os.homedir(), 'antigravity-zero/bin/iam-logger.mjs');

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} LIBRARIAN "${escapedMsg}"`);
    } catch (e) {
        console.log(`[IAM Error] ${e.message}`);
    }
}

async function findSkill(query) {
    logIAM(`📚 Iniciando busca semântica para: "${query}"`);
    
    try {
        const collectionsResult = await client.getCollections();
        const hasSkillCollection = collectionsResult.collections.find(c => c.name === 'open_claw_skills');

        if (!hasSkillCollection) {
            logIAM("⚠️ Coleção 'open_claw_skills' não encontrada.");
            return;
        }

        const result = await client.scroll('open_claw_skills', {
            limit: 5,
            with_payload: true
        });

        if (result.points.length > 0) {
            logIAM(`✅ Catalogadas ${result.points.length} habilidades.`);
            result.points.forEach(point => {
                const name = point.payload.name || "Sem Nome";
                const desc = point.payload.description || "Sem Descrição";
                console.log(`- ${name}: ${desc}`);
                if (name.toLowerCase().includes(query.toLowerCase())) {
                    logIAM(`🎯 Match encontrado! Habilidade: ${name}`);
                }
            });
        } else {
            logIAM("ℹ️ Biblioteca vazia.");
        }
    } catch (e) {
        logIAM(`❌ Erro na Biblioteca: ${e.message}`);
    }
}

const [,, query] = process.argv;
if (query) {
    findSkill(query);
} else {
    console.log("Usage: node swarm-librarian.mjs 'query'");
}
