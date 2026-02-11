/**
 * 📦 Git Phase Manager: MCP Taskmaster Integration
 * Automates branch creation, commits, and atomic phase tagging.
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const args = process.argv.slice(2);
const command = args[0];
const phaseId = args[1]; // Ex: PH-01-JARVIS-CORE-SYNC

if (!command || !phaseId) {
    console.error("Usage: node tools/git-phase-manager.mjs <start|commit|finish> <phase_id> [msg/theme]");
    process.exit(1);
}

function run(cmd) {
    try {
        console.log(`Executing: ${cmd}`);
        return execSync(cmd, { stdio: 'pipe' }).toString().trim();
    } catch (e) {
        console.error(`❌ Failed: ${cmd}`);
        console.error(e.stderr?.toString() || e.message);
        process.exit(1);
    }
}

function getPhasePath(id) {
    // Try direct ID match in .agent/phases
    const phasesDir = path.resolve('.agent/phases');
    if (fs.existsSync(path.join(phasesDir, id))) return path.join(phasesDir, id);

    // Try fuzzy grep (not implemented for simplicity, assuming precise ID)
    return null;
}

switch (command) {
    case 'start':
        console.log(`🚀 Starting Phase: ${phaseId}`);
        // 1. Check if git init
        try { run('git rev-parse --is-inside-work-tree'); } catch { run('git init'); }

        // 2. Create Branch
        run(`git checkout -b feature/${phaseId} || git checkout feature/${phaseId}`);

        // 3. Initial Commit (Empty or Phase Dir)
        run(`git add .agent/phases/${phaseId} || true`);
        run(`git commit -m "chore(${phaseId}): Start Phase [skip ci]" --allow-empty`);
        break;

    case 'commit':
        const taskId = args[2];
        const msg = args.slice(3).join(' ') || "Update";
        console.log(`💾 Committing Task ${taskId}: ${msg}`);
        run('git add .');
        run(`git commit -m "feat(${phaseId}): Task ${taskId} - ${msg}"`);
        break;

    case 'finish':
        const theme = args.slice(2).join(' ') || "Phase Completed";
        console.log(`🏁 Finishing Phase: ${phaseId} (${theme})`);

        // 1. Verify Clean
        run('git add .');
        try { run(`git commit -m "chore(${phaseId}): Final Polish"`); } catch { }

        // 2. Merge to Main
        run('git checkout main || git checkout -b main');
        run(`git merge feature/${phaseId} --no-ff -m "merge(${phaseId}): ${theme}"`);

        // 3. Tag
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const tagName = `v${date.replace(/-/g, '.')}-${phaseId}`;
        run(`git tag -a "${tagName}" -m "${phaseId}: ${theme}"`);

        // 4. Push (if remote exists)
        try {
            run('git push origin main --tags');
            console.log("✅ Pushed to origin/main");
        } catch (e) {
            console.warn("⚠️ Remote push failed (no remote configured?), but local merge/tag is done.");
        }

        // 5. Cleanup
        run(`git branch -d feature/${phaseId}`);
        console.log(`🎉 Phase ${phaseId} Merged & Tagged: ${tagName}`);
        break;

    default:
        console.error("Unknown command");
        process.exit(1);
}
