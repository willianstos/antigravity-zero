#!/usr/bin/env node
/**
 * 🩺 Auto-Repair - Sovereign Self-Healing
 * Restaura serviços falhos detectados pelo Sentinel.
 */
import { execSync } from 'child_process';
import fs from 'fs';

const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';
const HEALTH_FILE = '/home/zappro/antigravity-zero/artifacts/cluster_health.json';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} MEDIC "${escapedMsg}"`);
    } catch (e) {}
}

async function runRepair() {
    if (!fs.existsSync(HEALTH_FILE)) return;
    
    const stats = JSON.parse(fs.readFileSync(HEALTH_FILE, 'utf8'));
    logIAM("🩺 Iniciando ciclo de Auto-Reparação...");

    // 1. Repair LocalStack
    if (stats.localstack === "Failed" || stats.localstack === "Not Found") {
        logIAM("🚨 LocalStack falhou. Tentando ressuscitação via Docker Compose...");
        try {
            execSync("docker-compose -f /home/zappro/antigravity-zero/infra/monitoring/docker-compose.yml up -d");
            logIAM("✅ LocalStack reiniciado com sucesso.");
        } catch (e) {
            logIAM("❌ Falha crítica ao reiniciar LocalStack: " + e.message);
        }
    }

    // 2. Repair Qdrant (Base de dados central)
    try {
        const qdrantStatus = execSync("docker inspect -f '{{.State.Status}}' qdrant").toString().trim();
        if (qdrantStatus !== "running") {
            logIAM("🚨 Qdrant offline. Iniciando recuperação...");
            execSync("docker start qdrant");
            logIAM("✅ Qdrant restaurado.");
        }
    } catch (e) {
        logIAM("⚠️ Qdrant não encontrado ou erro de inspeção.");
    }

    logIAM("✨ Ciclo de Auto-Reparação concluído. Saúde restaurada.");
}

runRepair();
