#!/usr/bin/env node
// ================================================
// 🦅 GIT AUTO MASTER — Sovereign Sync Tool
// ================================================
import { execSync } from 'child_process';

const feature = process.argv[2];
if (!feature) {
    console.error('❌ Missing feature name. Usage: node git-auto.mjs <feature-name>');
    process.exit(1);
}

function run(cmd) {
    console.log(`🚀 Executing: ${cmd}`);
    try {
        return execSync(cmd, { stdio: 'inherit', encoding: 'utf-8' });
    } catch (e) {
        console.error(`❌ Failed: ${cmd}`);
        process.exit(1);
    }
}

console.log(`🦅 [GIT-AUTO] Starting Sovereign Sync for: ${feature}`);

// 1. Ensure we are on main and up to date
run('git checkout main');
run('git pull origin main');

// 2. Create feature branch
const branch = `feature/${feature}`;
run(`git checkout -b ${branch} || git checkout ${branch}`);

// 3. Add and commit
run('git add .');
try {
    run(`git commit -m "feat: ${feature} - Sovereign update 2026"`);
} catch (e) {
    console.log('ℹ️ No changes to commit.');
}

// 4. Push branch
run(`git push origin ${branch} --force`);

// 5. Merge to main
run('git checkout main');
run(`git merge ${branch} --no-edit`);

// 6. Push main
run('git push origin main');

// 7. Cleanup
run(`git branch -D ${branch}`);

console.log(`\n🦅 Sovereignty Sync: Feature "${feature}" merged into main.`);
console.log(`🔄 Status: Local and Remote in Sintonia Total.`);
