#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * IAM - Inter-Agent Messaging Logger
 * Padrão de fofoca entre agentes para o Dashboard
 */
const AGENTS = {
    ANTIGRAVITY: "🦅 Lead Architect",
    SCOUT: "🔭 The Scout",
    WORKER: "🛠️ The Worker",
    LIBRARIAN: "📚 Librarian"
};

const LOG_PATH = path.join(process.env.HOME, 'antigravity-zero/artifacts/swarm-iam.jsonl');

function log(agent, message, cardId = "main-task") {
    const entry = {
        timestamp: new Date().toISOString(),
        agent: AGENTS[agent] || agent,
        message,
        cardId
    };
    fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
    console.log(`[${entry.agent}] ${message}`);
}

const [,, agent, msg, id] = process.argv;
if (agent && msg) {
    log(agent, msg, id);
} else {
    console.log("Usage: node iam-logger.mjs AGENT 'Message' [CardID]");
}
