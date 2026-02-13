import { spawnSync, spawn } from 'child_process';
import { existsSync } from 'fs';

/**
 * 🤖 AIDER BRIDGE — DevOps Senior Terminal Interface
 * Uses AIDER AI Agent for code editing and system control.
 */
export default {
    /**
     * Executes a raw shell command.
     * @param {string} command - The command to run.
     * @param {boolean} useSudo - Whether to prepend sudo.
     */
    async shell({ command, useSudo = false }) {
        const finalCommand = useSudo ? `sudo ${command}` : command;
        console.log(`💻 [TERMINAL] Exutando: ${finalCommand}`);

        const result = spawnSync('bash', ['-c', finalCommand], {
            encoding: 'utf8',
            maxBuffer: 1024 * 1024 * 50 // 50MB buffer
        });

        if (result.status !== 0) {
            return {
                success: false,
                stdout: result.stdout,
                stderr: result.stderr,
                error: `Exit code ${result.status}`
            };
        }

        return {
            success: true,
            stdout: result.stdout,
            stderr: result.stderr
        };
    },

    /**
     * Uses AIDER to perform complex code changes or system tasks.
     * @param {string} mission - The mission description for Aider.
     * @param {string[]} files - Optional list of files to give to Aider.
     */
    async run({ mission, files = [] }) {
        console.log(`🧠 [AIDER] Iniciando missão: ${mission}`);

        // Build arguments
        const args = [
            '--message', mission,
            '--no-git', // Use repo's git but don't let aider auto-commit if preferred (or omit this)
            '--yes-always'
        ];

        // Add specific files if provided
        files.forEach(f => {
            if (existsSync(f)) args.push(f);
        });

        const proc = spawnSync('aider', args, {
            encoding: 'utf8',
            env: { ...process.env, AIDER_QUIET: '1' }
        });

        return {
            success: proc.status === 0,
            output: proc.stdout,
            error: proc.stderr
        };
    },

    /**
     * Legacy support for basic command execution
     */
    async execute({ command }) {
        return this.shell({ command });
    }
};
