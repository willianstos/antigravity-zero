#!/usr/bin/env node
// ================================================
// 🧪 SMOKE TEST — CORE CI (2026)
// Checks if core modules can be imported and initialized.
// ================================================

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function testImport(path, name) {
    try {
        const fullPath = join(ROOT, path);
        if (!existsSync(fullPath)) {
            console.error(`  ❌ ${name}: File not found at ${path}`);
            return false;
        }
        await import(`file://${fullPath}`);
        console.log(`  ✅ ${name}: Imported successfully`);
        return true;
    } catch (err) {
        console.error(`  ❌ ${name}: Import failed - ${err.message}`);
        return false;
    }
}

async function run() {
    console.log('🔥 Starting Sovereign Smoke Tests...');

    const tests = [
        { path: 'src/jarvis/orchestrator.mjs', name: 'Orchestrator' },
        { path: 'src/jarvis/ai/token-router.mjs', name: 'Token Router' },
        { path: 'src/jarvis/browser/openai-agent.mjs', name: 'OpenAI Agent' },
        { path: 'src/jarvis/search/perplexity-search.mjs', name: 'Perplexity Search' },
        { path: 'src/core/telegram-bot.js', name: 'Telegram Bot' }
    ];

    let passed = 0;
    for (const t of tests) {
        if (await testImport(t.path, t.name)) passed++;
    }

    console.log(`\n🏁 Smoke Test Result: ${passed}/${tests.length} passed.`);
    process.exit(passed === tests.length ? 0 : 1);
}

run();
