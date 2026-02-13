#!/usr/bin/env node
// ================================================
// 🦞→🤖 OPENCLAW → JARVIS BRIDGE
// Makes the Telegram bot the BRAIN of the system.
// It reads .context/ memos as memory, parses user
// commands, and dispatches to Jarvis agents.
// ================================================

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import contextManager from '../memory/context-manager.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// ROOT = antigravity-zero/ (3 levels up from src/jarvis/bridge/)
const ROOT = join(__dirname, '..', '..', '..');
const CONTEXT_DIR = join(ROOT, '.context');
const JARVIS_API = process.env.JARVIS_API || 'http://localhost:7777';

class OpenClawBridge {
    constructor() {
        this.memos = {};
        this.intentMap = new Map();
        this._loadMemos();
        this._buildIntentMap();
    }

    // ===== MEMO SYSTEM =====
    // Load all .context/*.md files as bot memory
    _loadMemos() {
        if (!existsSync(CONTEXT_DIR)) return;
        const files = readdirSync(CONTEXT_DIR).filter(f => f.endsWith('.md'));
        for (const file of files) {
            const key = file.replace('.md', '').toLowerCase();
            this.memos[key] = readFileSync(join(CONTEXT_DIR, file), 'utf8');
        }
        console.log(`🦞 [BRIDGE] Loaded ${Object.keys(this.memos).length} memos: ${Object.keys(this.memos).join(', ')}`);
    }

    // Get memo content for system prompt injection
    getSystemContext() {
        const system = this.memos['system'] || '';
        const agents = this.memos['agents'] || '';
        const rules = this.memos['rules'] || '';
        const sovereign = this.memos['sovereign'] || '';
        return `${sovereign}\n\n${system}\n\n${agents}\n\n${rules}`;
    }

    // Get specific memo
    getMemo(name) {
        return this.memos[name.toLowerCase()] || null;
    }

    // Log user/bot interaction into semantic memory
    async logInteraction(role, text) {
        await contextManager.addInteraction(role, text);
    }

    // Get combined context: Memos + Session Logs + Qdrant Memories + Repo Structure
    async getFullAwareness(query = '') {
        const persona = this.memos['persona'] || '';
        const base = this.getSystemContext();
        const session = await contextManager.getFullContext(query);

        let repoContext = '';
        if (query.match(/repositório|arquivo|código|pasta|estrutura|projeto|analise|audit|soberania|status/i)) {
            repoContext = `\n\n--- ESTRUTURA ATUAL DO REPOSITÓRIO ---\n${this._getRepoSummary()}\n\n`;

            // Auto-inject files mentioned in query
            const potentialFiles = query.match(/[a-zA-Z0-9_\-\/]+\.(js|mjs|py|sh|md|json|yml|yaml|tf|html|css)/g);
            if (potentialFiles) {
                repoContext += `--- CONTEÚDO DOS ARQUIVOS EM MEMÓRIA ---\n`;
                for (const f of potentialFiles) {
                    const fullPath = join(ROOT, f);
                    if (existsSync(fullPath)) {
                        repoContext += `\nFILE: ${f}\n\`\`\`\n${readFileSync(fullPath, 'utf8').substring(0, 8000)}\n\`\`\`\n`;
                    }
                }
            }
        }

        return `${persona}\n\n${base}\n\n${session}${repoContext}`;
    }

    _getRepoSummary() {
        try {
            // Lista arquivos na raiz e pastas principais (1 nível)
            const files = readdirSync(ROOT, { withFileTypes: true });
            let summary = 'Arquivos na Raiz:\n';
            files.forEach(f => {
                if (['node_modules', '.git', '.agent'].includes(f.name)) return;
                summary += `  - ${f.name}${f.isDirectory() ? '/' : ''}\n`;
            });

            // Adiciona Vision e Core
            summary += '\nSrc Core Content:\n';
            const coreFiles = readdirSync(join(ROOT, 'src', 'core'));
            coreFiles.forEach(f => summary += `  - src/core/${f}\n`);

            summary += '\nSrc Jarvis Content:\n';
            const jarvisDirs = readdirSync(join(ROOT, 'src', 'jarvis'));
            jarvisDirs.forEach(d => {
                if (d.includes('.')) return;
                summary += `  - src/jarvis/${d}/\n`;
            });

            return summary;
        } catch (err) {
            return `Erro ao ler pastas: ${err.message}`;
        }
    }

    // ===== INTENT DETECTION =====
    _buildIntentMap() {
        // Portuguese command patterns → agent + action
        this.intentMap.set(/^(screenshot|captura|tira foto|print|capturar tela)/i,
            { agent: 'vision', action: 'capture', params: {} });

        this.intentMap.set(/^(ler tela|ocr|o que tem na tela|le a tela)/i,
            { agent: 'vision', action: 'ocr', params: {} });

        this.intentMap.set(/^(clica|click|clicar) em (.+)/i,
            (match) => ({ agent: 'mouse', action: 'click', params: this._parseCoords(match[2]) }));

        this.intentMap.set(/^(digita|type|escreve|digite) (.+)/i,
            (match) => ({ agent: 'mouse', action: 'type', params: { text: match[2] } }));

        this.intentMap.set(/^(tecla|key|pressiona) (.+)/i,
            (match) => ({ agent: 'mouse', action: 'key', params: { combo: match[2] } }));

        this.intentMap.set(/^(abre|abrir|navegar|navigate|open) (.+)/i,
            (match) => ({ agent: 'browser', action: 'navigate', params: { url: this._normalizeUrl(match[2]) } }));

        this.intentMap.set(/^(roda|execute|executa|run|terminal) (.+)/i,
            (match) => ({ agent: 'terminal', action: 'shell', params: { command: match[2] } }));

        this.intentMap.set(/^(edita|edit|corrige|fix) (.+)/i,
            (match) => ({ agent: 'terminal', action: 'edit', params: { file: match[2], instruction: 'Fix issues' } }));

        this.intentMap.set(/^(status|como esta|health|saude)/i,
            { agent: '_system', action: 'status', params: {} });

        this.intentMap.set(/^(mouse|cursor) (.+)/i,
            (match) => {
                const coords = this._parseCoords(match[2]);
                return coords ? { agent: 'mouse', action: 'moveTo', params: coords } : null;
            });

        this.intentMap.set(/^(scroll|rola) (cima|baixo|up|down)/i,
            (match) => ({ agent: 'mouse', action: 'scroll', params: { direction: match[2].match(/cima|up/i) ? 'up' : 'down' } }));
    }

    // Parse user message into intent
    parseIntent(message) {
        const text = message.trim();

        for (const [pattern, handler] of this.intentMap) {
            const match = text.match(pattern);
            if (match) {
                if (typeof handler === 'function') {
                    return handler(match);
                }
                return { ...handler };
            }
        }

        return null; // No known intent — let Gemini handle it
    }

    // ===== JARVIS API DISPATCH =====
    async dispatch(intent) {
        if (!intent) return { success: false, error: 'No intent detected' };

        if (intent.agent === '_system') {
            return this._handleSystem(intent.action);
        }

        try {
            const res = await fetch(`${JARVIS_API}/api/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(intent)
            });
            return await res.json();
        } catch (err) {
            return { success: false, error: `Jarvis API offline: ${err.message}` };
        }
    }

    // Handle system commands locally
    async _handleSystem(action) {
        if (action === 'status') {
            try {
                const res = await fetch(`${JARVIS_API}/api/status`);
                return await res.json();
            } catch {
                return { success: false, error: 'Jarvis API offline' };
            }
        }
        return { success: false, error: `Unknown system action: ${action}` };
    }

    // ===== TELEGRAF MIDDLEWARE =====
    // Drop this into the existing OpenClaw bot:
    //   bot.on('text', bridge.middleware())
    middleware() {
        return async (ctx) => {
            const text = ctx.message?.text;
            if (!text) return;

            // Skip if it's a command handled by the bot itself
            if (text.startsWith('/')) return;

            const intent = this.parseIntent(text);
            if (!intent) return; // Not a Jarvis command, let Gemini handle it

            ctx.reply(`⚡ Executando: ${intent.agent}.${intent.action}...`);

            const result = await this.dispatch(intent);

            if (result.success) {
                const response = typeof result.result === 'object'
                    ? JSON.stringify(result.result, null, 2).substring(0, 1000)
                    : String(result.result || 'OK');
                ctx.reply(`✅ ${intent.agent}.${intent.action}\n\`\`\`\n${response}\n\`\`\``);
            } else {
                ctx.reply(`❌ ${result.error || 'Unknown error'}`);
            }
        };
    }

    // ===== HELPERS =====
    _parseCoords(text) {
        const match = text.match(/(\d+)\s*[,x]\s*(\d+)/);
        return match ? { x: parseInt(match[1]), y: parseInt(match[2]) } : null;
    }

    _normalizeUrl(text) {
        const url = text.trim();
        if (url.startsWith('http')) return url;
        if (url.includes('.')) return `https://${url}`;
        return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }

    // Info
    toString() {
        return `OpenClawBridge { memos: ${Object.keys(this.memos).length}, intents: ${this.intentMap.size} }`;
    }
}

// Self-test
if (process.argv.includes('--test')) {
    const bridge = new OpenClawBridge();
    console.log(`\n🧪 Bridge: ${bridge}`);
    console.log(`📝 System context: ${bridge.getSystemContext().length} chars`);

    const testCases = [
        'screenshot',
        'ler tela',
        'clica em 500,300',
        'digita Hello World',
        'tecla ctrl+c',
        'abre google.com',
        'roda uptime',
        'status',
        'scroll baixo',
        'mouse 100,200',
    ];

    console.log('\n🧪 Intent detection:');
    for (const tc of testCases) {
        const intent = bridge.parseIntent(tc);
        console.log(`  "${tc}" → ${intent ? `${intent.agent}.${intent.action}(${JSON.stringify(intent.params)})` : '❌ no match'}`);
    }
}

export default OpenClawBridge;
export { OpenClawBridge };
