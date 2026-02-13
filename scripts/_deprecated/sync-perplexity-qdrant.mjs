import { QdrantClient } from '@qdrant/js-client-rest';
import { execSync } from 'child_process';

const client = new QdrantClient({ host: 'localhost', port: 6333 });

async function sync() {
    console.log("🔄 Propagando Perplexity API na biblioteca de elite...");
    
    try {
        // 1. Remover vestígios do Brave
        await client.delete('open_claw_skills', {
            filter: {
                must: [{ key: 'name', match: { value: 'brave_search' } }]
            }
        });
        console.log("🗑️ Brave Search removido da biblioteca.");

        // 2. Inserir Perplexity Sonar-Pro
        await client.upsert('open_claw_skills', {
            wait: true,
            points: [{
                id: 1001, // ID fixo para ferramenta core
                vector: Array(1536).fill(0.1),
                payload: {
                    name: "perplexity_search",
                    description: "Busca informações atualizadas na internet via Perplexity Sonar-Pro (Sovereign Level).",
                    command: "node /home/zappro/antigravity-zero/bin/perplexity_search.mjs",
                    parameters: "query: string"
                }
            }]
        });
        console.log("✅ Perplexity Search (PH-12) propagado no Qdrant.");
        
        execSync("node /home/zappro/antigravity-zero/bin/iam-logger.mjs SCOUT 'Propagação PH-12 (Fix Perplexity) Concluída'");
    } catch (e) {
        console.error("❌ Erro na sincronização: " + e.message);
    }
}

sync();
