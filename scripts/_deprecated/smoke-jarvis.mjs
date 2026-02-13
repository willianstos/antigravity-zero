/**
 * 🕵️ Smoke Test: Jarvis Sovereignty Check
 * Versão: 1.0 (10/02/2026)
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log("🚀 Iniciando Smoke Test do Ecossistema Jarvis...");

const checks = [
    { name: "Node.js v22", cmd: "node -v", regex: /v22/ },
    { name: "Redis Server", cmd: "redis-cli ping", regex: /PONG/ },
    { name: "OpenClaw Core", cmd: "openclaw --version", regex: /openclaw/i },
    { name: "Config .env", cmd: "ls -la .env", regex: /\.env/ },
    { name: "Regras de Elite", cmd: "ls .agent/rules/porteiro_redis.md", regex: /porteiro_redis/ }
];

let failed = false;

checks.forEach(check => {
    try {
        const output = execSync(check.cmd).toString();
        if (check.regex.test(output)) {
            console.log(`✅ ${check.name}: PASS`);
        } else {
            console.log(`❌ ${check.name}: FAIL (Output inesperado: ${output.trim()})`);
            failed = true;
        }
    } catch (e) {
        console.log(`❌ ${check.name}: FAIL (Erro: ${e.message})`);
        failed = true;
    }
});

if (failed) {
    console.log("\n⚠️ Smoke Test FALHOU. Refatorando ambiente...");
    process.exit(1);
} else {
    console.log("\n💎 Sistema ESTÁVEL e pronto para Soberania.");
    process.exit(0);
}
