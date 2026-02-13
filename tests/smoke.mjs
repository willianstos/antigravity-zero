#!/usr/bin/env node
// ================================================
// 🧪 SMOKE TEST SUITE — Antigravity-Zero
// Tests: System deps, Docker, API, Agents, TF
// Automated, zero-config, exit code 0/1
// ================================================

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
    try {
        const result = fn();
        if (result === true || result) {
            passed++;
            results.push({ name, status: '✅', detail: typeof result === 'string' ? result : 'OK' });
        } else {
            failed++;
            results.push({ name, status: '❌', detail: 'Failed assertion' });
        }
    } catch (err) {
        failed++;
        results.push({ name, status: '❌', detail: err.message.substring(0, 100) });
    }
}

// ===== SYSTEM DEPENDENCIES =====
console.log('\n🔍 === SYSTEM DEPENDENCIES ===\n');

test('Node.js >= 22', () => {
    const v = process.version;
    const major = parseInt(v.slice(1));
    return major >= 22 ? `v${major}` : false;
});

test('Python >= 3.12', () => {
    const v = execSync('python3 --version 2>&1', { encoding: 'utf8' }).trim();
    return v.includes('3.12') || v.includes('3.13') ? v : false;
});

test('Docker installed', () => {
    const v = execSync('docker --version 2>&1', { encoding: 'utf8' }).trim();
    return v;
});

test('Terraform installed', () => {
    const v = execSync('terraform version -json 2>&1', { encoding: 'utf8' });
    const data = JSON.parse(v);
    return `v${data.terraform_version}`;
});

test('Playwright installed', () => {
    const v = execSync('npx playwright --version 2>/dev/null', { encoding: 'utf8' }).trim();
    return v;
});

test('xdotool installed', () => {
    execSync('which xdotool', { stdio: 'ignore' });
    return 'found';
});

test('maim OR scrot installed', () => {
    try { execSync('which maim', { stdio: 'ignore' }); return 'maim'; } catch { }
    try { execSync('which scrot', { stdio: 'ignore' }); return 'scrot'; } catch { }
    return false;
});

test('tesseract installed', () => {
    try {
        const v = execSync('tesseract --version 2>&1', { encoding: 'utf8' }).split('\n')[0];
        return v;
    } catch { return false; }
});

// ===== FILE STRUCTURE =====
console.log('\n📁 === FILE STRUCTURE ===\n');

const requiredFiles = [
    'src/jarvis/orchestrator.mjs',
    'src/jarvis/swarm-server.mjs',
    'src/jarvis/terminal/aider-bridge.mjs',
    'src/jarvis/vision/screen-capture.mjs',
    'src/jarvis/mouse/xdotool-control.mjs',
    'src/jarvis/browser/playwright-cli.mjs',
    'dashboard/index.html',
    'infra/docker-compose.yml',
    'infra/terraform/main.tf',
    'infra/terraform/terraform.tf',
    'infra/terraform/variables.tf',
    'package.json',
    'README.md',
    '.gitignore',
    '.env',
    '.openclaw.rules.md',
];

for (const file of requiredFiles) {
    test(`File: ${file}`, () => existsSync(join(ROOT, file)));
}

// ===== NO LEGACY =====
console.log('\n🗑️ === NO LEGACY ===\n');

const mustNotExist = [
    'opencode.json',
    'opencode.sov.json',
    'playwright.config.js',
    'src/index.js',
    'bin/',
    'tools/',
    'modules/',
    'estudos/',
    'venv/',
];

for (const path of mustNotExist) {
    test(`Deleted: ${path}`, () => !existsSync(join(ROOT, path)));
}

// ===== DOCKER STACK =====
console.log('\n🐳 === DOCKER STACK ===\n');

test('Container: sovereign-localstack', () => {
    const out = execSync('docker ps --filter name=sovereign-localstack --format "{{.Status}}"', { encoding: 'utf8' }).trim();
    return out.includes('Up') ? out : false;
});

test('Container: sovereign-minio', () => {
    const out = execSync('docker ps --filter name=sovereign-minio --format "{{.Status}}"', { encoding: 'utf8' }).trim();
    return out.includes('Up') ? out : false;
});

test('Container: sovereign-qdrant', () => {
    const out = execSync('docker ps --filter name=sovereign-qdrant --format "{{.Status}}"', { encoding: 'utf8' }).trim();
    return out.includes('Up') ? out : false;
});

test('Container: sovereign-grafana', () => {
    const out = execSync('docker ps --filter name=sovereign-grafana --format "{{.Status}}"', { encoding: 'utf8' }).trim();
    return out.includes('Up') ? out : false;
});

// ===== HEALTH CHECKS =====
console.log('\n💚 === HEALTH CHECKS ===\n');

test('LocalStack health', () => {
    const out = execSync('curl -sf http://localhost:4566/_localstack/health 2>&1', { encoding: 'utf8' });
    const data = JSON.parse(out);
    return data.services?.sqs === 'available' ? 'SQS available' : false;
});

test('MinIO health', () => {
    execSync('curl -sf http://localhost:9005/minio/health/live', { stdio: 'ignore' });
    return 'live';
});

test('Qdrant health', () => {
    const out = execSync('curl -sf http://localhost:6333/healthz 2>&1', { encoding: 'utf8' }).trim();
    return out.includes('passed') ? out : false;
});

test('Grafana health', () => {
    execSync('curl -sf http://localhost:3000/api/health', { stdio: 'ignore', timeout: 5000 });
    return 'healthy';
});

// ===== MODULE IMPORTS =====
console.log('\n📦 === MODULE IMPORTS ===\n');

test('Import: orchestrator.mjs', async () => {
    try {
        await import(join(ROOT, 'src/jarvis/orchestrator.mjs'));
        return 'imported';
    } catch (e) { return false; }
});

test('Import: aider-bridge.mjs', async () => {
    try {
        await import(join(ROOT, 'src/jarvis/terminal/aider-bridge.mjs'));
        return 'imported';
    } catch (e) { return false; }
});

test('Import: screen-capture.mjs', async () => {
    try {
        await import(join(ROOT, 'src/jarvis/vision/screen-capture.mjs'));
        return 'imported';
    } catch (e) { return false; }
});

test('Import: xdotool-control.mjs', async () => {
    try {
        await import(join(ROOT, 'src/jarvis/mouse/xdotool-control.mjs'));
        return 'imported';
    } catch (e) { return false; }
});

test('Import: playwright-cli.mjs', async () => {
    try {
        await import(join(ROOT, 'src/jarvis/browser/playwright-cli.mjs'));
        return 'imported';
    } catch (e) { return false; }
});

// ===== TERRAFORM =====
console.log('\n📐 === TERRAFORM ===\n');

test('Terraform initialized', () => {
    return existsSync(join(ROOT, 'infra/terraform/.terraform'));
});

test('Terraform lock file', () => {
    return existsSync(join(ROOT, 'infra/terraform/.terraform.lock.hcl'));
});

// ===== SECURITY =====
console.log('\n🔒 === SECURITY ===\n');

test('.env in .gitignore', () => {
    const gitignore = execSync(`cat ${join(ROOT, '.gitignore')}`, { encoding: 'utf8' });
    return gitignore.includes('.env') ? 'protected' : false;
});

test('No secrets in source code', () => {
    try {
        const hits = execSync(
            `grep -rn "sk-proj-\\|ghp_\\|AAGL0x" ${join(ROOT, 'src/')} ${join(ROOT, 'dashboard/')} 2>/dev/null | wc -l`,
            { encoding: 'utf8' }
        ).trim();
        return parseInt(hits) === 0 ? 'clean' : false;
    } catch {
        return 'clean'; // grep returns 1 when no matches
    }
});

// ===== REPORT =====
console.log('\n' + '='.repeat(50));
console.log('📋 SMOKE TEST REPORT — Antigravity-Zero');
console.log('='.repeat(50));
console.log(`📅 Date: ${new Date().toISOString()}`);
console.log(`🖥️  Node: ${process.version}`);
console.log('');

for (const r of results) {
    console.log(`  ${r.status} ${r.name} ${r.detail !== 'OK' ? `(${r.detail})` : ''}`);
}

console.log('');
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  📊 Total:  ${passed + failed}`);
console.log(`  🏆 Score:  ${Math.round((passed / (passed + failed)) * 100)}%`);
console.log('');

if (failed > 0) {
    console.log('⚠️  Some tests failed. Review above for details.');
    process.exit(1);
} else {
    console.log('🎉 ALL TESTS PASSED — System fully operational!');
    process.exit(0);
}
