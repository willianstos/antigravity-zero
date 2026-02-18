import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

/**
 * 🤖 AIDER BRIDGE — Sovereign Elite Edition (2026)
 * Non-blocking, stream-based execution engine for system control.
 * 
 * @module AiderBridge
 */

/**
 * @typedef {Object} ExecutionResult
 * @property {boolean} success - Whether the process exited with code 0
 * @property {string} stdout - Standard output captured
 * @property {string} stderr - Standard error captured
 * @property {number|null} code - Exit code
 * @property {number} duration - Execution time in ms
 */

export default {
    /**
     * Executes a shell command asynchronously with real-time stream monitoring.
     * Non-blocking implementation to keep the Event Loop alive.
     * 
     * @param {Object} params
     * @param {string} params.command - The raw command to execute
     * @param {boolean} [params.useSudo=false] - Elevate privileges
     * @param {string} [params.cwd] - Working directory
     * @param {number} [params.timeout=300000] - Max execution time (default 5m)
     * @returns {Promise<ExecutionResult>}
     */
    async shell({ command, useSudo = false, cwd = process.cwd(), timeout = 300000 }) {
        const startTime = Date.now();
        const finalCommand = useSudo ? `sudo -n ${command}` : command; // Non-interactive sudo check

        console.log(`⚡ [EXEC] Spawning: ${finalCommand.substring(0, 50)}... (CWD: ${cwd})`);

        return new Promise((resolve) => {
            const child = spawn(finalCommand, {
                shell: '/bin/bash',
                cwd,
                env: { ...process.env, FORCE_COLOR: '1', TERM: 'dumb' }, // Preserve colors for logs, but simplify PTY
                stdio: ['ignore', 'pipe', 'pipe']
            });

            let stdoutBuff = [];
            let stderrBuff = [];

            // Stream Handling with Buffer Limit Protection
            child.stdout.on('data', (chunk) => {
                if (stdoutBuff.length < 5000) stdoutBuff.push(chunk); // Prevent memory leak on huge logs
            });

            child.stderr.on('data', (chunk) => {
                if (stderrBuff.length < 5000) stderrBuff.push(chunk);
            });

            // Timeout Governance
            const timer = setTimeout(() => {
                child.kill('SIGTERM');
                resolve({
                    success: false,
                    stdout: Buffer.concat(stdoutBuff).toString(),
                    stderr: `[TIMEOUT] Process exceeded ${timeout}ms limit.\n` + Buffer.concat(stderrBuff).toString(),
                    code: 124, // UNIX timeout code
                    duration: Date.now() - startTime
                });
            }, timeout);

            child.on('close', (code) => {
                clearTimeout(timer);
                const duration = Date.now() - startTime;
                const stdoutStr = Buffer.concat(stdoutBuff).toString();
                const stderrStr = Buffer.concat(stderrBuff).toString();

                if (code !== 0) {
                    console.warn(`⚠️ [EXEC] Fail (Code ${code}) in ${duration}ms: ${stderrStr.substring(0, 100)}`);
                } else {
                    console.log(`✅ [EXEC] Success in ${duration}ms`);
                }

                resolve({
                    success: code === 0,
                    stdout: stdoutStr,
                    stderr: stderrStr,
                    code,
                    duration
                });
            });

            child.on('error', (err) => {
                clearTimeout(timer);
                resolve({
                    success: false,
                    stdout: '',
                    stderr: `Spawn Error: ${err.message}`,
                    code: -1,
                    duration: Date.now() - startTime
                });
            });
        });
    },

    /**
     * Orchestrates an Aider AI Agent session to modify code autonomously.
     * 
     * @param {Object} params
     * @param {string} params.mission - The change description
     * @param {string[]} [params.files=[]] - Context files
     */
    async run({ mission, files = [] }) {
        console.log(`🧠 [AIDER] Initializing Sovereign Edit: "${mission}"`);

        const validFiles = files.filter(f => existsSync(f));
        if (validFiles.length === 0 && files.length > 0) {
            console.warn('⚠️ [AIDER] No valid files found from input list.');
        }

        // Construct Aider Command for v2026 Standards
        // Assuming 'aider' is in PATH. If simple shell spawn fails, we might need full path.
        const aiderArgs = [
            'aider',
            '--message', `"${mission.replace(/"/g, '\\"')}"`,
            '--no-auto-commits', // We manage commits via Git Sovereign
            '--yes', // Non-interactive mode
            '--no-pretty', // Raw output for parsing
            ...validFiles
        ];

        return this.shell({
            command: aiderArgs.join(' '),
            timeout: 600000 // 10 minutes for AI thinking
        });
    },

    /**
     * Legacy adapter for backward compatibility
     */
    async execute(params) {
        return this.shell(params);
    }
};
