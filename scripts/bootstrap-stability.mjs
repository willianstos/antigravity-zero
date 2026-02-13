#!/usr/bin/env node
/**
 * 🚀 JARVIS BOOTSTRAP 2026
 * Valida a estabilidade de toda a stack DevOps antes da operação.
 * Executa em modo Full-Auto.
 */

import { spawnSync } from 'child_process';
import fetch from 'node-fetch';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // Se o script está em scripts/, ROOT deve ser o diretório pai.

const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m"
};

async function check(name, fn) {
    process.stdout.write(`🛠️  Auditando ${name}... `);
    try {
        await fn();
        console.log(`${colors.green}ESTÁVEL (200 OK)${colors.reset}`);
        return true;
    } catch (err) {
        console.log(`${colors.red}FALHA (${err.message})${colors.reset}`);
        return false;
    }
}

async function main() {
    console.log(`\n${colors.cyan}🛡️  INICIANDO BOOTSTRAP DE ESTABILIDADE — 13/02/2026${colors.reset}`);
    console.log("----------------------------------------------------------");

    const tasks = [
        {
            name: "Infraestrutura Docker",
            fn: async () => {
                const ps = spawnSync('docker', ['compose', 'ps', '--format', 'json'], { cwd: join(ROOT, 'infra') });
                if (ps.status !== 0) throw new Error("Docker Compose offline");
            }
        },
        {
            name: "Memória Qdrant",
            fn: async () => {
                const res = await fetch('http://127.0.0.1:6333/healthz');
                if (!res.ok) throw new Error("Qdrant não responde");
            }
        },
        {
            name: "Bucket MinIO (Storage)",
            fn: async () => {
                const res = await fetch('http://127.0.0.1:9005/minio/health/live');
                if (!res.ok) throw new Error("MinIO offline");
            }
        },
        {
            name: "API Jarvis",
            fn: async () => {
                const res = await fetch('http://127.0.0.1:7777/api/status');
                if (!res.ok) throw new Error("Server Jarvis offline");
            }
        },
        {
            name: "Contexto Soberano",
            fn: async () => {
                const roadmap = fs.existsSync(join(ROOT, '.context', 'ROADMAP.md'));
                const persona = fs.existsSync(join(ROOT, '.context', 'PERSONA.md'));
                if (!roadmap || !persona) throw new Error("Arquivos de contexto ausentes");
            }
        }
    ];

    let allOk = true;
    for (const t of tasks) {
        const ok = await check(t.name, t.fn);
        if (!ok) allOk = false;
    }

    if (allOk) {
        console.log(`\n${colors.green}🏆 CLUSTER ESTÁVEL. OPERAÇÃO SOBERANA AUTORIZADA.${colors.reset}\n`);
    } else {
        console.log(`\n${colors.red}❌ INSTABILIDADE DETECTADA. REVISE OS LOGS.${colors.reset}\n`);
        process.exit(1);
    }
}

main();
