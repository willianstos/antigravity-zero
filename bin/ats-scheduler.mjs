#!/usr/bin/env node
/**
 * 🦅 ATS (Autonomous Task Scheduler) - H1 Director
 * Gerencia o swarm_schedule.json e dispara tarefas via MCP.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SCHEDULE_FILE = '/home/zappro/antigravity-zero/bin/ats-scheduler/data/swarm_schedule.json';
const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} DIRECTOR "${escapedMsg}"`);
    } catch (e) { }
}

if (!fs.existsSync(SCHEDULE_FILE)) {
    const dataDir = path.dirname(SCHEDULE_FILE);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify({
        tasks: [
            { id: "daily_audit", name: "Auditoria IaC Diária", cron: "0 8 * * *", command: "terraform plan", node: "H2" },
            { id: "context_cleanup", name: "Janitor Context Compaction", cron: "0 */4 * * *", command: "node bin/janitor-protocol.mjs", node: "H1" },
            { id: "gitops_reconcile", name: "GitOps Reconcile (Argo-Like)", cron: "*/5 * * * *", command: "node bin/sovereign-operator.mjs", node: "H1" }
        ]
    }, null, 2));
}

// --- Configurações PH-MAX v10.5 ---
const MAX_GPU_TEMP = 75; // Celsius
const JANITOR_INTERVAL = 4 * 60 * 60 * 1000; // 4 Hours

function checkThermal() {
    try {
        const tempOutput = execSync("nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader").toString().trim();
        const temp = parseInt(tempOutput);

        if (temp > MAX_GPU_TEMP) {
            logIAM(`⚠️ Thermal Alert: GPU at ${temp}°C! Throttle vision feed and LAM missions.`);
            // Ação: Matar processos de visão pesados se necessário
            return false;
        }
        logIAM("✅ Saúde Térmica: Estável. Cluster pronto para Full Motion LAM.");
        return true;
    } catch (e) {
        return true; // Assume safe if no nvidia-smi
    }
}

const HEARTBEAT_INTERVAL = 30 * 60 * 1000; // 30 Minutes Deep Heartbeat
const THERMAL_INTERVAL = 5 * 60 * 1000; // 5 Minutes Safety Check

function runHeartbeat() {
    logIAM("💓 Deep Heartbeat (30m) Iniciado. Verificando Sincronia Master...");

    try {
        // GitOps Sync (BK)
        execSync("git pull origin main --quiet");
        logIAM("🔄 GitOps: Sincronizado com Main Cloud.");

        // Verifica Saúde H1/H2
        checkThermal();

        logIAM("✅ Heartbeat 30m Concluído. Swarm estável.");
    } catch (e) {
        logIAM(`⚠️ Falha no Heartbeat: ${e.message}`);
    }
}

// Inicialização Master
logIAM("🏛️ ATS Ativo (v11.0). Orquestrando Soberania Máxima.");
runHeartbeat();

// Agendamentos
setInterval(checkThermal, THERMAL_INTERVAL);
setInterval(runHeartbeat, HEARTBEAT_INTERVAL);
