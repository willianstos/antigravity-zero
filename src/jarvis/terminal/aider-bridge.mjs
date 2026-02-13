#!/usr/bin/env node
// ================================================
// 🖥️ AIDER BRIDGE — AI Pair Programming Controller
// Wraps AIDER CLI for autonomous code editing
// ================================================

import { spawn, execSync } from 'child_process';
import { EventEmitter } from 'events';

class AiderBridge extends EventEmitter {
    constructor(opts = {}) {
        super();
        this.workDir = opts.workDir || process.cwd();
        this.model = opts.model || 'openrouter/google/gemini-2.0-flash-001';
        this.process = null;
    }

    // Check if AIDER is installed
    async check() {
        try {
            const version = execSync('aider --version 2>&1', { encoding: 'utf8' }).trim();
            return { installed: true, version };
        } catch {
            return { installed: false, version: null };
        }
    }

    // Execute a code edit task via AIDER
    async edit({ file, instruction, autoCommit = false }) {
        return new Promise((resolve, reject) => {
            const args = [
                '--yes-always',
                '--no-auto-lint',
                '--message', instruction,
                file
            ];

            if (!autoCommit) args.push('--no-auto-commits');

            const proc = spawn('aider', args, {
                cwd: this.workDir,
                stdio: ['pipe', 'pipe', 'pipe'],
                env: { ...process.env }
            });

            let stdout = '';
            let stderr = '';

            proc.stdout.on('data', d => { stdout += d.toString(); });
            proc.stderr.on('data', d => { stderr += d.toString(); });

            proc.on('close', code => {
                if (code === 0) {
                    resolve({ success: true, output: stdout, file });
                } else {
                    reject(new Error(`AIDER exit ${code}: ${stderr}`));
                }
            });

            // Timeout 120s
            setTimeout(() => {
                proc.kill('SIGTERM');
                reject(new Error('AIDER timeout (120s)'));
            }, 120000);
        });
    }

    // Execute arbitrary shell command safely
    async shell({ command, timeout = 30000 }) {
        return new Promise((resolve, reject) => {
            const proc = spawn('bash', ['-c', command], {
                cwd: this.workDir,
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout
            });

            let stdout = '';
            let stderr = '';

            proc.stdout.on('data', d => { stdout += d.toString(); });
            proc.stderr.on('data', d => { stderr += d.toString(); });

            proc.on('close', code => {
                resolve({
                    success: code === 0,
                    exitCode: code,
                    stdout: stdout.trim(),
                    stderr: stderr.trim()
                });
            });

            proc.on('error', reject);
        });
    }
}

// Export as agent interface
const bridge = new AiderBridge();
export default bridge;
export const edit = (params) => bridge.edit(params);
export const shell = (params) => bridge.shell(params);
export const check = () => bridge.check();
