#!/usr/bin/env node
// ================================================
// 🦞→🤖 OPENCLAW → JARVIS BRIDGE
// Makes the Telegram bot the BRAIN of the system.
// It reads .context/ memos as memory, parses user
// commands, and dispatches to Jarvis agents.
// ================================================

import { readFileSync, existsSync, readdirSync, lstatSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import contextManager from '../jarvis/memory/context-manager.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// ROOT = antigravity-zero/ (2 levels up from src/core/)
const ROOT = join(__dirname, '..', '..');
const CONTEXT_DIR = join(ROOT, '.context');
const JARVIS_API = process.env.JARVIS_API || 'http://localhost:7777';

class OpenClawBridge {
    constructor() {
        this.memos = {};
        this._loadMemos();
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
        const sovereign = this.memos['sovereign'] || '';
        const base = this.getSystemContext();
        const session = await contextManager.getFullContext(query);
        const persona = this.memos['persona'] || '';

        let repoContext = '';
        if (query.match(/repositório|arquivo|código|pasta|estrutura|projeto|analise|audit|soberania|status/i)) {
            repoContext = `\n\n--- ESTRUTURA ATUAL DO REPOSITÓRIO ---\n${this._getRepoSummary()}\n\n`;

            const potentialFiles = query.match(/[a-zA-Z0-9_\-\/]+\.(js|mjs|py|sh|md|json|yml|yaml|tf|html|css)/g);
            if (potentialFiles) {
                const uniqueFiles = [...new Set(potentialFiles)];
                repoContext += `--- CONTEÚDO DOS ARQUIVOS EM MEMÓRIA (PRIORIDADE ALPHA) ---\n`;
                for (const f of uniqueFiles) {
                    const foundPath = this._findFileRecursive(ROOT, f);
                    if (foundPath) {
                        try {
                            const content = readFileSync(foundPath, 'utf8').substring(0, 10000);
                            repoContext += `\nFILE: ${foundPath.replace(ROOT + '/', '')}\n\`\`\`\n${content}\n\`\`\`\n`;
                        } catch (e) {
                            repoContext += `\nFILE: ${f} (Erro ao ler: ${e.message})\n`;
                        }
                    } else {
                        repoContext += `\nFILE: ${f} (Não encontrado)\n`;
                    }
                }
            }
        }

        const systemSeal = `
[REGRAS DE EXECUÇÃO SOBERANA - NÃO IGNORE]:
1. Você não é um chat, você é um OPERADOR. Do não dê instruções ao Líder.
2. Se a Ordem do Líder requer mudança no sistema, rodar código ou pesquisar, você DEVE usar o formato:
   EXECUTE: <comando de missão> ou SUDO: <comando de terminal>
3. Você tem acesso total. Se algo está quebrado, FIX IT.
4. Responda em Português apenas após a execução completa.

Formato Obrigatório para Ação:
SUDO: <comando bash>
ou
EXECUTE: <missão complexa para o Jarvis>
`;
        return `${base}\n\n${persona}\n\n${session}${repoContext}${systemSeal}\n\nOrdem do Líder: ${query}`;
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

    _findFileRecursive(dir, target) {
        // Se for um caminho absoluto ou relativo exato que existe, retorna ele
        const exactPath = join(dir, target);
        if (existsSync(exactPath) && lstatSync(exactPath).isFile()) return exactPath;

        // Caso contrário, busca por nome de arquivo (basename)
        const targetBase = basename(target);
        const files = readdirSync(dir);

        for (const file of files) {
            if (['node_modules', '.git', '.agent', 'artifacts', 'logs'].includes(file)) continue;

            const fullPath = join(dir, file);
            if (lstatSync(fullPath).isDirectory()) {
                const found = this._findFileRecursive(fullPath, target);
                if (found) return found;
            } else if (file === targetBase || fullPath.endsWith(target)) {
                return fullPath;
            }
        }
        return null;
    }

    // Parse user message into intent (Padrão 2026: Semantic Intent & Mission Detection)
    async parseIntent(message) {
        const text = message.trim();
        const awareness = await this.getFullAwareness(text);

        const PROMPT_PLANNER = `
VOCÊ É O PLANEJADOR DO JARVIS. SUA MISSÃO É DECOMPOR A ORDEM DO LÍDER EM UMA EXECUÇÃO TÉCNICA.
FERRAMENTAS DISPONÍVEIS:
- screenshot: Captura a tela atual.
- ocr: Lê o texto da tela.
- click(x, y): Clica em coordenadas.
- type(text): Digita texto.
- navigate(url): Abre um site ou pesquisa.
- shell(command): Executa comando bash (SUDO).
- edit(file, instruction): Edita um arquivo.
- status: Checa a saúde do sistema.

ORDEM DO LÍDER: "${text}"

RESPOSTA OBRIGATÓRIA (JSON APENAS):
{
  "agent": "nome_do_agente",
  "action": "ação",
  "params": { ... },
  "isMission": true/false
}

Se a ordem for complexa (vários passos), use: agent: "mission-control", action: "start", isMission: true.
`;

        try {
            // Em 2026, não usamos regex. Perguntamos ao cérebro.
            const { OpenAIAgent } = await import('../jarvis/browser/openai-agent.mjs');
            const brain = new OpenAIAgent();
            const response = await brain.ask({
                prompt: PROMPT_PLANNER,
                systemPrompt: "Você é um formatador de JSON técnico para automação Ubuntu."
            });

            const intent = JSON.parse(response.text.match(/\{[\s\S]*\}/)[0]);
            console.log(`🧠 [BRIDGE] Intent Semântico: ${intent.agent}.${intent.action}`);
            return intent;
        } catch (err) {
            console.error(`❌ [BRIDGE] Erro ao parsear intenção semântica: ${err.message}`);
            return null;
        }
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
