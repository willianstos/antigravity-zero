#!/usr/bin/env node
/**
 * 🕵️ Skill Auditor - Sovereign Registry
 * Limpa o Qdrant de duplicatas e códigos legados.
 */
import { QdrantClient } from '@qdrant/js-client-rest';
import { execSync } from 'child_process';

const client = new QdrantClient({ host: 'localhost', port: 6333 });
const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} AUDITOR "${escapedMsg}"`);
    } catch (e) { }
}

async function runAudit() {
    logIAM("🕵️ Auditoria de Skills Iniciada (Limpando lixo eletrônico)...");

    try {
        const collections = ["swarm_toolbox", "open_claw_skills"];
        let deletedCount = 0;

        for (const collection of collections) {
            logIAM(`🔍 Analisando coleção: ${collection}...`);
            // Check if collection exists first
            const collectionLogs = await client.getCollections();
            if (!collectionLogs.collections.some(c => c.name === collection)) {
                logIAM(`⚠️ Coleção ${collection} não encontrada.`);
                continue;
            }

            const points = await client.scroll(collection, { limit: 100, with_payload: true });

            const seenNames = new Set();
            for (const point of points.points) {
                const name = point.payload.name || point.id;
                const content = point.payload.content || "";

                // 1. Detectar duplicatas
                if (seenNames.has(name)) {
                    await client.delete(collection, { points: [point.id] });
                    deletedCount++;
                    continue;
                }
                seenNames.add(name);

                // 2. Detectar código obsoleto (axios)
                if (content.includes("axios") || content.includes("require('axios')")) {
                    logIAM(`⚠️ Habilidade obsoleta detectada: ${name} (Usa Axios). Deletando...`);
                    await client.delete(collection, { points: [point.id] });
                    deletedCount++;
                }
            }
        }

        logIAM(`✨ Auditoria concluída. ${deletedCount} pontos removidos. Entropia reduzida.`);
        return deletedCount;
    } catch (e) {
        logIAM("❌ Erro na Auditoria: " + e.message);
    }
}

runAudit();
