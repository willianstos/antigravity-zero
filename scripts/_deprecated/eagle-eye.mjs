#!/usr/bin/env node
/**
 * 👁️ EAGLE EYE - Jarvis Sovereign Monitoring & Auto-Fix
 * CEO Level Autonomy for Cluster H2
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.env.HOME, 'antigravity-zero/artifacts/eagle-eye.log');
const IAM_LOGGER = path.join(process.env.HOME, 'antigravity-zero/bin/iam-logger.mjs');

function logIAM(msg) {
    try {
        execSync(`node ${IAM_LOGGER} ANTIGRAVITY "${msg}"`);
    } catch (e) {
        log(`[IAM Error] ${e.message}`);
    }
}

function log(msg) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    fs.appendFileSync(LOG_FILE, entry);
}

function checkService(name) {
    try {
        // Suporte para snap docker
        const cmd = name.includes('docker') ? 'snap services docker' : `systemctl is-active ${name}`;
        const out = execSync(cmd).toString();
        return out.includes('active') || out.includes('running');
    } catch (e) {
        return false;
    }
}

function autoFix() {
    logIAM("🛡️ Iniciando Auditoria de Ciclo Fechado (Iron Architect Protocol)...");

    // 1. Check Qdrant (via snap/docker)
    const qdrantActive = checkService('docker');
    if (!qdrantActive) {
        logIAM("⚠️ Detector: Docker/Qdrant offline. Iniciando Auto-Fix...");
        try { execSync('sudo snap restart docker'); logIAM("✅ Sucesso: Docker reiniciado pelo Auditor."); } catch (e) { logIAM("❌ Falha Crítica: Auditor não conseguiu levantar o Docker."); }
    }

    // 2. Check OpenClaw
    const openclawActive = checkService('openclaw.service');
    if (!openclawActive) {
        logIAM("⚠️ Detector: OpenClaw Service offline. Iniciando Auto-Fix...");
        try { execSync('sudo systemctl restart openclaw.service'); logIAM("✅ Sucesso: OpenClaw reiniciado pelo Auditor."); } catch (e) { logIAM("❌ Falha Crítica: Auditor não conseguiu levantar o OpenClaw."); }
    }

    // 3. Disk Space
    try {
        const usage = execSync("df / | tail -1 | awk '{print $5}' | sed 's/%//'").toString().trim();
        if (parseInt(usage) > 90) {
            logIAM(`🚨 Alerta de CEO: Espaço em disco em ${usage}%. Executando limpeza soberana...`);
            execSync('sudo journalctl --vacuum-time=1d');
            logIAM("✅ Sucesso: Logs limpos. Soberania de armazenamento mantida.");
        }
    } catch (e) { logIAM("❌ Erro ao verificar disco."); }

    logIAM("🟢 Auditoria concluída. Sistema Estável.");
}

if (process.argv.includes('--fix')) {
    autoFix();
} else {
    log("Status: Operativo. Use --fix para rodar auditoria.");
}
