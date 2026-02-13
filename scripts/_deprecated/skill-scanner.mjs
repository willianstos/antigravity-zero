#!/usr/bin/env node
/**
 * 🛡️ Agent Trust Hub - Skill Scanner (v12.0)
 * Auditoria de segurança zero-trust para Skills do cluster.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SKILLS_DIR = '/home/zappro/antigravity-zero/.agent/skills';
const IAM_LOGGER = '/home/zappro/antigravity-zero/bin/iam-logger.mjs';

function logIAM(msg) {
    try {
        const escapedMsg = msg.replace(/"/g, '\\"');
        execSync(`node ${IAM_LOGGER} TRUST_HUB "${escapedMsg}"`);
    } catch (e) { }
}

const MALICIOUS_PATTERNS = [
    /curl.*\.env/i,
    /fetch.*secret/i,
    /exfiltrate/i,
    /upload.*\.openclaw/i,
    /rm -rf \//i,
    /ignore.*instructions/i,
    /env | nc/i
];

function scanSkill(skillPath) {
    const files = fs.readdirSync(skillPath);
    let score = 0;
    let threats = [];

    files.forEach(file => {
        const filePath = path.join(skillPath, file);
        if (fs.lstatSync(filePath).isFile()) {
            const content = fs.readFileSync(filePath, 'utf8');
            MALICIOUS_PATTERNS.forEach(pattern => {
                if (pattern.test(content)) {
                    score += 10;
                    threats.push(`Found pattern: ${pattern} in ${file}`);
                }
            });
        }
    });

    return { score, threats };
}

async function runAudit() {
    logIAM("🛡️ Iniciando Auditoria Agent Trust Hub (Zero-Trust)...");

    const skills = fs.readdirSync(SKILLS_DIR);
    let foundRisk = false;

    skills.forEach(skill => {
        const skillPath = path.join(SKILLS_DIR, skill);
        if (fs.lstatSync(skillPath).isDirectory()) {
            const { score, threats } = scanSkill(skillPath);
            if (score > 0) {
                logIAM(`⚠️ ALERTA DE RISCO: Skill [${skill}] score ${score}!`);
                threats.forEach(t => logIAM(`   - ${t}`));
                foundRisk = true;
            }
        }
    });

    if (!foundRisk) {
        logIAM("✅ Todas as skills passaram no scanner de segurança. Cluster Limpo.");
    }
}

runAudit();
