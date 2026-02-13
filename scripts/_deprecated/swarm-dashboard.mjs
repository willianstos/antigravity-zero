#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * 📊 SWARM DASHBOARD - Visão de Enxame (Estilo Notion/Trello)
 * Transforma o log JSONL em uma visão legível.
 */

const LOG_PATH = path.join(process.env.HOME, 'antigravity-zero/artifacts/swarm-iam.jsonl');

function renderDashboard() {
    if (!fs.existsSync(LOG_PATH)) {
        console.log("📭 Dashboard vazio. Enxame em repouso.");
        return;
    }

    const lines = fs.readFileSync(LOG_PATH, 'utf8').trim().split('\n');
    const tasks = {};

    lines.forEach(line => {
        const entry = JSON.parse(line);
        if (!tasks[entry.cardId]) {
            tasks[entry.cardId] = {
                id: entry.cardId,
                status: "Unknown",
                comments: []
            };
        }

        // Mapeamento Simples de Status
        if (entry.message.includes("Iniciando")) tasks[entry.cardId].status = "🧠 Thinking";
        if (entry.message.includes("🛠️")) tasks[entry.cardId].status = "🔨 Building";
        if (entry.message.includes("🛡️")) tasks[entry.cardId].status = "⚖️ Auditing";
        if (entry.message.includes("✅")) tasks[entry.cardId].status = "🚩 Deployed";
        if (entry.message.includes("❌")) tasks[entry.cardId].status = "💥 Failed";

        tasks[entry.cardId].comments.push(`[${entry.agent}] ${entry.message}`);
    });

    console.log("\n========================================================");
    console.log("🦅 JARVIS SOVEREIGN - SWARM DASHBOARD (CLUSTER H2)");
    console.log("========================================================\n");

    console.log("🎯 PAINEL DE METAS CEO (REFRIMIX & ZAPPRO):");
    console.log("   1. Maximizar faturamento via Automação Agêntica.");
    console.log("   2. Soberania total do Cluster H2.");
    console.log("   3. Resposta zero-delay em suporte HVAC.");
    console.log("--------------------------------------------------------\n");

    Object.values(tasks).forEach(task => {
        console.log(`📌 CARD: ${task.id}`);
        console.log(`📊 STATUS: ${task.status}`);
        console.log("💬 COMENTÁRIOS DO ENXAME:");
        task.comments.slice(-3).forEach(c => console.log(`   - ${c}`));
        console.log("--------------------------------------------------------");
    });
}

renderDashboard();
