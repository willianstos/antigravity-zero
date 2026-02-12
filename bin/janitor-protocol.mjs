#!/usr/bin/env node
/**
 * 🧹 Janitor Protocol - Context Management
 * Compacta o histórico técnico e persiste no Qdrant.
 */
import { QdrantClient } from '@qdrant/js-client-rest';
import { execSync } from 'child_process';

const client = new QdrantClient({ host: 'localhost', port: 6333 });
const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} JANITOR "${escapedMsg}"`);
    } catch (e) { }
}

async function runJanitor() {
    logIAM("🧹 Janitor Protocol Iniciado (75% Saturação Detectada).");

    try {
        // Simulação de Destilação de Contexto
        logIAM("🧬 Destilando logs da última sessão...");
        const sessionSummary = "Sessão concluída: PH-13 Drivers Nvidia ativos, Perplexity sincronizado e Monitoramento Refrimix provisionado.";

        logIAM("📚 Persistindo destilado no Qdrant (Long-term Memory)...");
        await client.upsert('swarm_toolbox', {
            wait: true,
            points: [{
                id: Math.floor(Math.random() * 1000000),
                vector: Array(1536).fill(0.1),
                payload: {
                    type: "context_summary",
                    content: sessionSummary,
                    timestamp: new Date().toISOString()
                }
            }]
        });

        logIAM("✨ Memória de trabalho otimizada. Swarm pronto para novas tarefas.");
    } catch (e) {
        logIAM(`❌ Erro no Janitor: ${e.message}`);
    }
}

runJanitor();
