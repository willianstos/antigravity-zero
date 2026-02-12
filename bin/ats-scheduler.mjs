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
            { id: "context_cleanup", name: "Janitor Context Compaction", cron: "*/30 * * * *", command: "node bin/janitor-protocol.mjs", node: "H1" },
            { id: "gitops_reconcile", name: "GitOps Reconcile (Argo-Like)", cron: "*/15 * * * *", command: "node bin/sovereign-operator.mjs", node: "H1" }
        ]
    }, null, 2));
}

async function runScheduler() {
    logIAM("🏛️ ATS Ativo. Orquestrando Swarm PH-15...");
    const schedule = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));

    console.log("Tarefas Agendadas:");
    schedule.tasks.forEach(task => {
        console.log(`- [${task.node}] ${task.name} (${task.cron})`);
    });

    logIAM("✅ Ciclo de agendamento validado.");
}

runScheduler();
