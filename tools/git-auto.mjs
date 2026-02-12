/**
 * 🚀 Git Auto-Feature Tool
 * Usage: node tools/git-auto.mjs <feature-kebab-cased-name>
 */

import { execSync } from 'child_process';
import crypto from 'crypto';

const featureName = process.argv[2];

if (!featureName) {
    console.error("❌ Usage: node tools/git-auto.mjs <feature-name>");
    process.exit(1);
}

// 1. Creative Commit Generator
const verbs = ['Implement', 'Refactor', 'Polish', 'Optimize', 'Deploy', 'Construct', 'Architect', 'Shipped'];
const emojis = ['🚀', '🎨', '🔧', '⚡', '📦', '🏗️', '🧹', '💎'];
const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

const commitMsg = `feat(${featureName}): ${randomVerb} logic and components ${randomEmoji}`;

// 2. Dates
const now = new Date();
const dateStr = now.toISOString().split('T')[0].replace(/-/g, '.'); // 2026.02.11
const timeHash = crypto.randomBytes(2).toString('hex');
const tagName = `v${dateStr}-${featureName}-${timeHash}`;

function stripAnsi(text) {
    return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

function run(cmd) {
    try {
        console.log(`> ${cmd}`);
        const output = execSync(cmd).toString();
        console.log(stripAnsi(output).trim());
    } catch (e) {
        if (e.stdout) console.log(stripAnsi(e.stdout.toString()).trim());
        if (e.stderr) console.error(stripAnsi(e.stderr.toString()).trim());
    }
}

console.log(`\n🔥 GIT AUTO: Feature [${featureName}]`);
console.log(`----------------------------------------`);

// 3. Execution
// Ensure clean state handled by user or forced add
run(`git checkout -b feature/${featureName} 2>/dev/null || git checkout feature/${featureName}`);
run('git add .');
run(`git commit -m "${commitMsg}" --allow-empty`);
run(`git tag -a "${tagName}" -m "Auto-tag for ${featureName}"`);

// Optional Push
try {
    run('git push origin HEAD --tags');
} catch (e) {
    console.log("⚠️ Push skipped (no remote or network issue). Local state secured.");
}

console.log(`\n✅ SUCCESS!`);
console.log(`   Branch: feature/${featureName}`);
console.log(`   Commit: "${commitMsg}"`);
console.log(`   Tag:    ${tagName}`);
