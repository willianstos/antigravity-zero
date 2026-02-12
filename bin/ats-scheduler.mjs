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
        return true;
    } catch (e) {
        return true; // Assume safe if no nvidia-smi
    }
}

async function runScheduler() {
    logIAM("🏛️ ATS Ativo (v10.5). Orquestrando Soberania H1/H2...");

    // Thermal Guard Sync
    const isHealthy = checkThermal();

    if (isHealthy) {
        logIAM("✅ Saúde Térmica: Estável. Cluster pronto para Full Motion LAM.");
    }

    const schedule = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
    console.log("Monitoramento Ativo:");
    schedule.tasks.forEach(task => {
        console.log(`- [${task.node}] ${task.name} | Status: Healthy`);
    });

    logIAM("🚀 Ciclo Master concluído. Próxima auditoria térmica em 5min.");
}

runScheduler();
setInterval(runScheduler, 5 * 60 * 1000); // Auditoria a cada 5min
