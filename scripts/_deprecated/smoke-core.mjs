/**
 * 🕵️ Smoke Core: Jarvis System Validator
 * Versão: 2.1 (OpenClaw Fix)
 */

import { execSync } from 'child_process';
import fs from 'fs';

const checks = [
    { name: "[RUNTIME] Node.js v22", cmd: "node -v", regex: /v22/ },
    { name: "[CACHE] Redis PONG", cmd: "redis-cli ping", regex: /PONG/ },
    { name: "[ENGINE] OpenClaw CLI", cmd: "openclaw --version", regex: /[\d\.]+|openclaw/i },
    { name: "[ENV] .env Exists", cmd: "test -f .env && echo 'ok'", regex: /ok/ }
];

console.log("🔍 Running Jarvis Smoke Core...");
let failed = false;

checks.forEach(c => {
    let out = "";
    try {
        out = execSync(c.cmd, { stdio: 'pipe' }).toString().trim();
        if (c.regex.test(out)) {
            console.log(`✅ ${c.name} (${out})`);
        } else {
            console.error(`❌ ${c.name} (Expected regex: ${c.regex}, Got: ${out})`);
            failed = true;
        }
    } catch (e) {
        console.error(`❌ ${c.name} (Error: ${e.message.split('\n')[0]})`);
        failed = true;
    }
});

process.exit(failed ? 1 : 0);
