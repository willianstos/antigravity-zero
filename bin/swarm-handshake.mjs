#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * 🤝 SWARM HANDSHAKE - Relatório de Prontidão do Enxame
 * Antigravity (Lead Architect) verifica a saúde dos sub-agentes.
 */

const IAM_LOGGER = path.join(process.env.HOME, 'antigravity-zero/bin/iam-logger.mjs');

function logIAM(agent, msg) {
    try {
        execSync(`node ${IAM_LOGGER} ${agent} "${msg}"`);
    } catch (e) {
        console.log(`[IAM Error] ${e.message}`);
    }
}

async function verifyReadiness() {
    console.log("🤝 Iniciando Handshake do Enxame...");
    logIAM("ANTIGRAVITY", "Iniciando verificação de prontidão do enxame (Pre-Flight Check).");

    const status = {
        qdrant: false,
        openclaw: false,
        disk: false,
        iam: true
    };

    // 1. Verificando Librarian (Qdrant)
    try {
        const qOut = execSync('curl -s localhost:6333/').toString();
        if (qOut.includes('qdrant')) {
            status.qdrant = true;
            logIAM("LIBRARIAN", "Pronto. Conexão com Qdrant estabelecida.");
        }
    } catch (e) {
        logIAM("LIBRARIAN", "ERRO: Qdrant inacessível.");
    }

    // 2. Verificando Scout/Worker (OpenClaw)
    try {
        const oOut = execSync('systemctl is-active openclaw.service').toString().trim();
        if (oOut === 'active') {
            status.openclaw = true;
            logIAM("SCOUT", "Pronto. Serviço OpenClaw operante.");
        }
    } catch (e) {
        logIAM("SCOUT", "ERRO: OpenClaw Service falhou.");
    }

    // 3. Verificando Espaço de Trabalho
    const usage = parseInt(execSync("df / | tail -1 | awk '{print $5}' | sed 's/%//'").toString().trim());
    if (usage < 95) {
        status.disk = true;
        logIAM("WORKER", `Pronto. Espaço disponível (${usage}% de uso).`);
    } else {
        logIAM("WORKER", "ERRO: Espaço em disco insuficiente.");
    }

    const allReady = Object.values(status).every(v => v === true);
    if (allReady) {
        logIAM("ANTIGRAVITY", "✅ HANDSHAKE CONCLUÍDO. Enxame em prontidão total. Missão Autorizada.");
        console.log("✅ Enxame pronto!");
    } else {
        logIAM("ANTIGRAVITY", "❌ HANDSHAKE FALHOU. Algum agente está offline. Abortando missão.");
        console.error("❌ Falha no Handshake.");
        process.exit(1);
    }
}

verifyReadiness();
