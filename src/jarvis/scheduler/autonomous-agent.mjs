#!/usr/bin/env node
// ================================================
// 🤖 AUTONOMOUS SCHEDULER — Self-Waking Agent
// The bot wakes up independently, checks for tasks,
// executes them, reports via Telegram, goes to sleep.
// Lighter than Kestra, Temporal, N8N — zero UI needed
// ================================================

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');
const TASKS_DIR = join(ROOT, 'data', 'scheduler');
const TASKS_FILE = join(TASKS_DIR, 'tasks.json');
const HISTORY_FILE = join(TASKS_DIR, 'history.json');
const JARVIS_API = process.env.JARVIS_API || 'http://localhost:7777';

if (!existsSync(TASKS_DIR)) mkdirSync(TASKS_DIR, { recursive: true });

class AutonomousScheduler {
    constructor() {
        this.tasks = this._loadTasks();
        this.history = this._loadHistory();
        this.running = false;
    }

    // ===== TASK MANAGEMENT =====

    // Add a scheduled task
    addTask({ name, agent, action, params = {}, schedule, enabled = true }) {
        const task = {
            id: `task_${Date.now()}`,
            name,
            agent,
            action,
            params,
            schedule, // cron-like: '*/5 * * * *' or interval in ms
            enabled,
            lastRun: null,
            lastResult: null,
            runCount: 0,
            createdAt: new Date().toISOString()
        };
        this.tasks.push(task);
        this._saveTasks();
        console.log(`📋 [SCHEDULER] Added: ${name} (${schedule})`);
        return task;
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this._saveTasks();
    }

    // ===== SCHEDULE EXECUTION =====

    // Start the scheduler loop
    async start() {
        this.running = true;
        console.log('🤖 [SCHEDULER] Autonomous agent started');
        console.log(`📋 [SCHEDULER] ${this.tasks.length} tasks loaded`);

        // Check tasks every 30 seconds
        while (this.running) {
            await this._tick();
            await this._sleep(30000);
        }
    }

    stop() {
        this.running = false;
        console.log('🤖 [SCHEDULER] Stopped');
    }

    async _tick() {
        const now = Date.now();
        for (const task of this.tasks) {
            if (!task.enabled) continue;
            if (this._shouldRun(task, now)) {
                await this._executeTask(task);
            }
        }
    }

    _shouldRun(task, now) {
        if (!task.lastRun) return true; // Never run before

        // Parse schedule
        if (typeof task.schedule === 'number') {
            // Interval in ms
            return (now - new Date(task.lastRun).getTime()) >= task.schedule;
        }

        if (typeof task.schedule === 'string') {
            // Simple cron-like: 'every:5m', 'every:1h', 'every:30s'
            const match = task.schedule.match(/every:(\d+)(s|m|h|d)/);
            if (match) {
                const value = parseInt(match[1]);
                const unit = match[2];
                const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
                const intervalMs = value * (multipliers[unit] || 60000);
                return (now - new Date(task.lastRun).getTime()) >= intervalMs;
            }
        }

        return false;
    }

    async _executeTask(task) {
        console.log(`⚡ [SCHEDULER] Executing: ${task.name} (${task.agent}.${task.action})`);
        const startTime = Date.now();

        try {
            let result;

            // Try Jarvis API first
            try {
                const res = await fetch(`${JARVIS_API}/api/execute`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ agent: task.agent, action: task.action, params: task.params })
                });
                result = await res.json();
            } catch {
                // Fallback: execute locally
                result = this._executeLocal(task);
            }

            const duration = Date.now() - startTime;
            task.lastRun = new Date().toISOString();
            task.lastResult = { success: true, duration, data: result };
            task.runCount++;

            // Log to history
            this.history.push({
                taskId: task.id,
                name: task.name,
                timestamp: task.lastRun,
                duration,
                success: true,
                result: JSON.stringify(result).substring(0, 500)
            });

            console.log(`  ✅ ${task.name}: ${duration}ms`);

            // Notify via Telegram (fire-and-forget)
            this._notifyTelegram(`✅ Task "${task.name}" completed in ${duration}ms`);

        } catch (err) {
            task.lastRun = new Date().toISOString();
            task.lastResult = { success: false, error: err.message };

            this.history.push({
                taskId: task.id,
                name: task.name,
                timestamp: task.lastRun,
                success: false,
                error: err.message
            });

            console.log(`  ❌ ${task.name}: ${err.message}`);
            this._notifyTelegram(`❌ Task "${task.name}" failed: ${err.message}`);
        }

        this._saveTasks();
        this._saveHistory();
    }

    _executeLocal(task) {
        if (task.agent === 'terminal' && task.action === 'shell') {
            return { stdout: execSync(task.params.command, { encoding: 'utf8', timeout: 30000, cwd: ROOT }).trim() };
        }
        throw new Error('Local execution not supported for this agent/action');
    }

    async _notifyTelegram(message) {
        try {
            const token = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_ADMIN_ID || '7220607041';
            if (!token) return;
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: `🤖 [Scheduler] ${message}` })
            });
        } catch { } // Best effort
    }

    // ===== PERSISTENCE =====
    _loadTasks() {
        if (!existsSync(TASKS_FILE)) return this._defaultTasks();
        try { return JSON.parse(readFileSync(TASKS_FILE, 'utf8')); } catch { return this._defaultTasks(); }
    }

    _saveTasks() {
        writeFileSync(TASKS_FILE, JSON.stringify(this.tasks, null, 2));
    }

    _loadHistory() {
        if (!existsSync(HISTORY_FILE)) return [];
        try {
            const h = JSON.parse(readFileSync(HISTORY_FILE, 'utf8'));
            return h.slice(-200); // Keep last 200
        } catch { return []; }
    }

    _saveHistory() {
        if (this.history.length > 200) this.history = this.history.slice(-200);
        writeFileSync(HISTORY_FILE, JSON.stringify(this.history, null, 2));
    }

    // Default tasks that run out-of-the-box
    _defaultTasks() {
        return [
            {
                id: 'task_health_check',
                name: 'Health Check Infra',
                agent: 'terminal',
                action: 'shell',
                params: { command: 'docker ps --format "{{.Names}}: {{.Status}}" | head -5' },
                schedule: 'every:5m',
                enabled: true,
                lastRun: null, lastResult: null, runCount: 0,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task_disk_check',
                name: 'Disk Usage Alert',
                agent: 'terminal',
                action: 'shell',
                params: { command: 'df -h / | tail -1 | awk \'{if($5+0 > 90) print "⚠️ DISK USAGE: "$5; else print "💽 Disk OK: "$5}\'' },
                schedule: 'every:30m',
                enabled: true,
                lastRun: null, lastResult: null, runCount: 0,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task_memory_check',
                name: 'Memory Usage Alert',
                agent: 'terminal',
                action: 'shell',
                params: { command: 'free -h | grep Mem | awk \'{print "RAM: "$3"/"$2}\'' },
                schedule: 'every:10m',
                enabled: true,
                lastRun: null, lastResult: null, runCount: 0,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task_gpu_check',
                name: 'GPU Status',
                agent: 'terminal',
                action: 'shell',
                params: { command: 'nvidia-smi --query-gpu=utilization.gpu,memory.used,temperature.gpu --format=csv,noheader 2>/dev/null || echo "GPU: N/A"' },
                schedule: 'every:15m',
                enabled: true,
                lastRun: null, lastResult: null, runCount: 0,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task_git_auto_save',
                name: 'Git Auto-Save',
                agent: 'terminal',
                action: 'shell',
                params: { command: 'cd /home/zappro/antigravity-zero && git add -A && git diff --cached --quiet || git commit -m "chore: auto-save $(date +%H:%M)" --no-verify 2>/dev/null && echo "Git: saved" || echo "Git: nothing to save"' },
                schedule: 'every:1h',
                enabled: true,
                lastRun: null, lastResult: null, runCount: 0,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Status
    getStatus() {
        return {
            running: this.running,
            taskCount: this.tasks.length,
            enabledCount: this.tasks.filter(t => t.enabled).length,
            tasks: this.tasks.map(t => ({
                id: t.id,
                name: t.name,
                schedule: t.schedule,
                enabled: t.enabled,
                lastRun: t.lastRun,
                runCount: t.runCount,
                lastSuccess: t.lastResult?.success
            })),
            historyCount: this.history.length
        };
    }

    _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
}

// ===== CLI =====
if (process.argv.includes('--start')) {
    // Load .env
    const envPath = join(ROOT, '.env');
    if (existsSync(envPath)) {
        for (const line of readFileSync(envPath, 'utf8').split('\n')) {
            const t = line.trim();
            if (!t || t.startsWith('#')) continue;
            const eq = t.indexOf('=');
            if (eq === -1) continue;
            const key = t.slice(0, eq).trim();
            let val = t.slice(eq + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
            if (!process.env[key]) process.env[key] = val;
        }
    }

    const scheduler = new AutonomousScheduler();
    scheduler.start();

    process.once('SIGINT', () => { scheduler.stop(); process.exit(0); });
    process.once('SIGTERM', () => { scheduler.stop(); process.exit(0); });
}

if (process.argv.includes('--status')) {
    const scheduler = new AutonomousScheduler();
    console.log(JSON.stringify(scheduler.getStatus(), null, 2));
}

export default AutonomousScheduler;
export { AutonomousScheduler };
