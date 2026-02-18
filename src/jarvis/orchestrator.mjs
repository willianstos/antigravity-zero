#!/usr/bin/env node
// ================================================
// 🤖 JARVIS ORCHESTRATOR — Central Nervous System
// Controls: Terminal, Vision, Mouse, Browser
// Hub: OpenClaw Bot (Telegram) → Swarm Agents
// ================================================

import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { readFileSync, existsSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

class JarvisOrchestrator extends EventEmitter {
    constructor() {
        super();
        this.agents = new Map();
        this.taskQueue = [];
        this.status = 'initializing';
        this.startTime = Date.now();
        this.metrics = { tasksCompleted: 0, tasksFailed: 0, uptime: 0 };
        this.auditPath = join(ROOT, 'logs', 'audit.log');
    }

    auditLog(agent, action, params) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] AGENT: ${agent} | ACTION: ${action} | PARAMS: ${JSON.stringify(params)}\n`;
        appendFileSync(this.auditPath, logEntry);
    }

    async boot() {
        console.log('🤖 [JARVIS] Booting Orchestrator...');
        console.log(`📂 Root: ${ROOT}`);
        console.log(`⏰ Start: ${new Date().toISOString()}`);

        // Register all agent modules
        this.registerAgent('terminal', await import('./terminal/aider-bridge.mjs'));
        this.registerAgent('vision', await import('./vision/screen-capture.mjs'));
        this.registerAgent('mouse', await import('./mouse/xdotool-control.mjs'));
        this.registerAgent('browser', await import('./browser/playwright-cli.mjs'));

        // Register Stateful Agents (Classes)
        const { GeminiWeb } = await import('./browser/gemini-web.mjs');
        this.registerAgent('gemini-web', new GeminiWeb());

        const { PerplexitySearch } = await import('./search/perplexity-search.mjs');
        this.registerAgent('perplexity', new PerplexitySearch());

        const { PersistentBrowser } = await import('./browser/persistent-browser.mjs');
        this.registerAgent('persistent-browser', new PersistentBrowser());

        const { OpenAIAgent } = await import('./browser/openai-agent.mjs');
        this.registerAgent('openai', new OpenAIAgent());

        const { MissionControl } = await import('./orchestrator/mission-control.mjs');
        this.registerAgent('mission-control', new MissionControl());

        this.status = 'ready';
        console.log(`✅ [JARVIS] All ${this.agents.size} agents online`);
        this.emit('ready', this.getStatus());
        return this;
    }

    registerAgent(name, module) {
        const agent = {
            name,
            module: module.default || module,
            status: 'idle',
            lastTask: null,
            taskCount: 0,
        };
        this.agents.set(name, agent);
        console.log(`  ✦ Agent "${name}" registered`);
    }

    async execute(agentName, action, params = {}) {
        const agent = this.agents.get(agentName);
        if (!agent) throw new Error(`Agent "${agentName}" not found`);

        agent.status = 'busy';
        agent.lastTask = { action, params, startedAt: Date.now() };

        try {
            console.log(`⚡ [${agentName}] Executando: ${action}`);

            // Auditoria para comandos de alto impacto
            if (agentName === 'terminal' || action === 'delete' || action === 'edit' || action === 'run') {
                this.auditLog(agentName, action, params);
            }

            const result = await agent.module[action](params);
            agent.status = 'idle';
            agent.taskCount++;
            this.metrics.tasksCompleted++;
            this.emit('task:complete', { agent: agentName, action, result });
            return { success: true, agent: agentName, action, result };
        } catch (err) {
            console.error(`❌ [${agentName}] Erro na execução: ${err.message}`);
            agent.status = 'error';
            this.metrics.tasksFailed++;
            this.emit('task:error', { agent: agentName, action, error: err.message });
            return { success: false, agent: agentName, action, error: err.message };
        }
    }

    // Swarm: execute across multiple agents
    async swarm(tasks) {
        console.log(`🐝 [SWARM] Dispatching ${tasks.length} tasks...`);
        const results = await Promise.allSettled(
            tasks.map(t => this.execute(t.agent, t.action, t.params))
        );
        return results.map(r => r.status === 'fulfilled' ? r.value : r.reason);
    }

    getStatus() {
        const agentStatuses = {};
        for (const [name, agent] of this.agents) {
            agentStatuses[name] = {
                status: agent.status,
                taskCount: agent.taskCount,
                lastTask: agent.lastTask?.action || null
            };
        }
        return {
            status: this.status,
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
            agents: agentStatuses,
            metrics: this.metrics,
            timestamp: new Date().toISOString()
        };
    }

    // API endpoint for dashboard
    toJSON() {
        return this.getStatus();
    }
}

// Self-test mode
if (process.argv.includes('--test')) {
    const jarvis = new JarvisOrchestrator();
    console.log('🧪 [TEST MODE] Running self-diagnostics...');

    const checks = [
        { name: 'Terminal Agent', file: './terminal/aider-bridge.mjs' },
        { name: 'Vision Agent', file: './vision/screen-capture.mjs' },
        { name: 'Mouse Agent', file: './mouse/xdotool-control.mjs' },
        { name: 'Browser Agent', file: './browser/playwright-cli.mjs' },
    ];

    let passed = 0;
    for (const check of checks) {
        try {
            const fullPath = join(__dirname, check.file);
            if (existsSync(fullPath)) {
                await import(fullPath);
                console.log(`  ✅ ${check.name}: OK`);
                passed++;
            } else {
                console.log(`  ⚠️  ${check.name}: File missing (${check.file})`);
            }
        } catch (err) {
            console.log(`  ❌ ${check.name}: ${err.message}`);
        }
    }

    console.log(`\n🏁 Result: ${passed}/${checks.length} agents operational`);
    process.exit(passed === checks.length ? 0 : 1);
}

export default JarvisOrchestrator;
export { JarvisOrchestrator };
