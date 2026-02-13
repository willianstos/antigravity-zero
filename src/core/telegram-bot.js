#!/usr/bin/env node
// ================================================
// 🦞 OPENCLAW JARVIS CONTROLLER
// Telegram Bot with Inline Keyboard Actions
// Controls: Terminal, Vision, Mouse, Browser
// via Jarvis Swarm API
// ================================================

import { Telegraf, Markup } from 'telegraf';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { OpenClawBridge } from './openclaw-bridge.mjs';
import { sanitize } from '../security/input-sanitizer.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');

// Load env
const envPath = join(ROOT, '.env');
if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = parseInt(process.env.TELEGRAM_ADMIN_ID || '7220607041');
const JARVIS_API = process.env.JARVIS_API || 'http://localhost:7777';

if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found in .env');
    process.exit(1);
}

// Init
const bot = new Telegraf(BOT_TOKEN);
const bridge = new OpenClawBridge();

console.log(`🦞 [OPENCLAW] Iniciando Controlador Jarvis...`);
console.log(`📝 [OPENCLAW] Carregados ${Object.keys(bridge.memos).length} memos de .context/`);
console.log(`🧠 [OPENCLAW] Contexto do sistema: ${bridge.getSystemContext().length} caracteres`);

// ===== AUTH MIDDLEWARE =====
bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    if (userId !== ADMIN_ID) {
        console.log(`⛔ Unauthorized access attempt from user ${userId}`);
        return ctx.reply('⛔ Acesso negado. Apenas o Líder pode usar este bot.');
    }
    return next();
});

// ===== /start — Main menu with inline keyboard =====
bot.start((ctx) => {
    ctx.reply(
        '🤖 **Jarvis Sovereign — Command Center**\n\n' +
        'Escolha uma ação ou digite um comando em texto livre:\n' +
        '`screenshot`, `ler tela`, `abre google.com`, `roda uptime`',
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('📸 Screenshot', 'act:vision:capture'),
                    Markup.button.callback('👁️ OCR Tela', 'act:vision:ocr'),
                ],
                [
                    Markup.button.callback('🧠 Gemini Web', 'act:gemini:ask'),
                    Markup.button.callback('🔍 Perplexity', 'act:perplexity:search'),
                ],
                [
                    Markup.button.callback('👤 Switch Profile', 'act:browser:switch'),
                    Markup.button.callback('🔒 Secure Browser', 'act:browser:secure'),
                ],
                [
                    Markup.button.callback('🖥️ System Info', 'act:terminal:sysinfo'),
                    Markup.button.callback('💚 Health Check', 'act:system:health'),
                ],
                [
                    Markup.button.callback('🌐 Abrir Google', 'act:browser:google'),
                    Markup.button.callback('🌐 Abrir Dashboard', 'act:browser:dashboard'),
                ],
                [
                    Markup.button.callback('🖱️ Mouse → Centro', 'act:mouse:center'),
                    Markup.button.callback('⌨️ Tecla Enter', 'act:mouse:enter'),
                ],
                [
                    Markup.button.callback('📊 Status Jarvis', 'act:system:status'),
                    Markup.button.callback('🧪 Self-Test', 'act:system:selftest'),
                ],
            ])
        }
    );
});

// ===== /jarvis — Menu de ações rápidas =====
bot.command('jarvis', (ctx) => {
    ctx.reply(
        '⚡ **Ações Rápidas**',
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('📸 Capturar Tela', 'act:vision:capture'),
                    Markup.button.callback('👁️ Ler Tela (OCR)', 'act:vision:ocr'),
                ],
                [
                    Markup.button.callback('🔄 Refresh Infra', 'act:system:infra'),
                    Markup.button.callback('📋 Ver Memos', 'act:system:memos'),
                ],
            ])
        }
    );
});

// ===== /demo — Run desktop demo =====
bot.command('demo', async (ctx) => {
    ctx.reply('🎬 Iniciando demo ao vivo... Mouse + Terminal + Browser');
    const result = await jarvisExec('terminal', 'shell', { command: 'node scripts/demo.mjs 2>&1 | tail -20' });
    ctx.reply(`\`\`\`\n${result}\n\`\`\``, { parse_mode: 'Markdown' });
});

// ===== INLINE KEYBOARD ACTIONS =====
bot.action(/^act:(.+):(.+)$/, async (ctx) => {
    const [, category, action] = ctx.match;
    await ctx.answerCbQuery(`⚡ ${action}...`);

    let result;

    switch (`${category}:${action}`) {
        case 'vision:capture':
            ctx.reply('📸 Capturando tela...');
            result = await jarvisExec('vision', 'capture', {});
            if (result?.path) {
                try {
                    // Send screenshot as photo
                    ctx.replyWithPhoto({ source: result.path });
                } catch {
                    ctx.reply(`📸 Screenshot salvo: ${result.path}`);
                }
            } else {
                ctx.reply(`📸 ${JSON.stringify(result)}`);
            }
            break;

        case 'vision:ocr':
            ctx.reply('👁️ Lendo tela...');
            result = await jarvisExec('vision', 'ocr', {});
            ctx.reply(`👁️ **OCR Result:**\n\`\`\`\n${(result?.text || 'no text').substring(0, 3000)}\n\`\`\``, { parse_mode: 'Markdown' });
            break;

        case 'gemini:ask':
            ctx.reply('🧠 Para usar o Gemini Web, envie uma mensagem começando com:\n\n`gemini: Sua pergunta aqui`\n\nIsso usará a sessão browser logada (ZERO tokens).');
            break;

        case 'perplexity:search':
            ctx.reply('🔍 Para pesquisar no Perplexity, envie:\n\n`search: Sua busca aqui`\n\nIsso trará fontes e dados atuais.');
            break;

        case 'browser:switch':
            ctx.reply('👤 **Escolha o Perfil do Chrome:**', {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    Markup.button.callback('👽 Estudante (Alien)', 'act:profile:alien'),
                    Markup.button.callback('👑 Principal (Will)', 'act:profile:will'),
                ])
            });
            break;

        case 'profile:alien':
            ctx.reply('👽 Alternando para **Perfil Alien**...');
            await jarvisExec('gemini-web', 'switchProfile', 'alien');
            ctx.reply('👽 Perfil Alien ATIVO. Próximas buscas usarão esta conta.');
            break;

        case 'profile:will':
            ctx.reply('👑 Alternando para **Perfil Will**...');
            await jarvisExec('gemini-web', 'switchProfile', 'willian');
            ctx.reply('👑 Perfil Will ATIVO.');
            break;

        case 'browser:secure':
            ctx.reply('🔒 Abrindo Secure Persistent Browser...');
            await jarvisExec('persistent-browser', 'launch', 'Default');
            ctx.reply('🔒 Browser aberto (Sessão Logada).');
            break;

        case 'terminal:sysinfo':
            ctx.reply('🖥️ Coletando info...');
            result = await jarvisExec('terminal', 'shell', {
                command: 'echo "🖥️ $(hostname) | $(uname -r)" && echo "💾 RAM: $(free -h | grep Mem | awk \'{print $3\"/\"$2}\')" && echo "🎮 GPU: $(nvidia-smi --query-gpu=utilization.gpu,memory.used --format=csv,noheader 2>/dev/null || echo N/A)" && echo "💽 Disk: $(df -h / | tail -1 | awk \'{print $3\"/\"$2}\')" && echo "⏰ Uptime: $(uptime -p)"'
            });
            ctx.reply(`\`\`\`\n${result?.stdout || result?.output || JSON.stringify(result)}\n\`\`\``, { parse_mode: 'Markdown' });
            break;

        case 'browser:google':
            ctx.reply('🌐 Abrindo Google...');
            result = await jarvisExec('browser', 'navigate', { url: 'https://www.google.com' });
            ctx.reply(`🌐 ${result?.title || JSON.stringify(result)}`);
            break;

        case 'browser:dashboard':
            ctx.reply('🌐 Abrindo Dashboard...');
            result = await jarvisExec('browser', 'navigate', { url: 'http://localhost:7777' });
            ctx.reply(`🌐 Dashboard: ${result?.title || 'opened'}`);
            break;

        case 'mouse:center':
            ctx.reply('🖱️ Movendo mouse para o centro...');
            result = await jarvisExec('mouse', 'moveTo', { x: 960, y: 540 });
            ctx.reply('🖱️ Mouse no centro da tela!');
            break;

        case 'mouse:enter':
            ctx.reply('⌨️ Pressionando Enter...');
            result = await jarvisExec('mouse', 'key', { combo: 'Return' });
            ctx.reply('⌨️ Enter pressionado!');
            break;

        case 'system:status':
            result = await fetchJarvisStatus();
            ctx.reply(`📊 **Jarvis Status:**\n\`\`\`json\n${JSON.stringify(result, null, 2).substring(0, 3000)}\n\`\`\``, { parse_mode: 'Markdown' });
            break;

        case 'system:health':
            ctx.reply('💚 Verificando saúde...');
            result = await jarvisExec('terminal', 'shell', {
                command: 'echo "LocalStack: $(curl -sf http://localhost:4566/_localstack/health | jq -r .services.sqs 2>/dev/null || echo DOWN)" && echo "MinIO: $(curl -sf http://localhost:9005/minio/health/live > /dev/null 2>&1 && echo UP || echo DOWN)" && echo "Qdrant: $(curl -sf http://localhost:6333/healthz 2>/dev/null || echo DOWN)" && echo "Grafana: $(curl -sf http://localhost:3000/api/health > /dev/null 2>&1 && echo UP || echo DOWN)"'
            });
            ctx.reply(`💚 **Health:**\n\`\`\`\n${result?.stdout || JSON.stringify(result)}\n\`\`\``, { parse_mode: 'Markdown' });
            break;

        case 'system:selftest':
            ctx.reply('🧪 Rodando smoke tests...');
            result = await jarvisExec('terminal', 'shell', { command: 'node tests/smoke.mjs 2>&1 | tail -15' });
            ctx.reply(`🧪 **Test Results:**\n\`\`\`\n${result?.stdout || JSON.stringify(result)}\n\`\`\``, { parse_mode: 'Markdown' });
            break;

        case 'system:infra':
            ctx.reply('🔄 Refreshing infra...');
            result = await jarvisExec('terminal', 'shell', { command: 'cd infra && docker compose ps --format "table {{.Name}}\t{{.Status}}" 2>&1' });
            ctx.reply(`🐳 **Containers:**\n\`\`\`\n${result?.stdout || JSON.stringify(result)}\n\`\`\``, { parse_mode: 'Markdown' });
            break;

        case 'system:memos':
            const memoNames = Object.keys(bridge.memos);
            ctx.reply(
                `📋 **Memos carregados (${memoNames.length}):**\n` +
                memoNames.map(m => `  • \`${m}.md\` (${bridge.memos[m].length} chars)`).join('\n'),
                { parse_mode: 'Markdown' }
            );
            break;

        default:
            ctx.reply(`❓ Ação desconhecida: ${category}:${action}`);
    }
});

// ===== TEXT MESSAGE — Natural language intent detection =====
bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return; // Skip commands

    // 🛡️ Anti-prompt injection
    const check = sanitize(text);
    if (!check.safe) {
        console.log(`🛡️ [SECURITY] Blocked: "${text.substring(0, 50)}..." — ${check.reason}`);
        return ctx.reply(`🛡️ Entrada bloqueada: ${check.reason}`);
    }

    // 🧠 LOG TO SEMANTIC MEMORY (Infinite Context)
    await bridge.logInteraction('user', text);

    // 🦅 MODO SOBERANO: Execução Direta
    if (text.toUpperCase().startsWith('SUDO:')) {
        const command = text.slice(5).trim();
        ctx.reply(`🛡️ **SUDO EXEC:** \`${command}\`...`);
        const res = await jarvisExec('terminal', 'shell', { command, useSudo: true });
        const output = res.stdout || res.stderr || JSON.stringify(res);
        await bridge.logInteraction('jarvis', `SUDO EXEC: ${command} -> ${output.substring(0, 100)}`);
        return ctx.reply(`🛡️ **Resultado (Sudo):**\n\`\`\`\n${output.substring(0, 4000)}\n\`\`\``, { parse_mode: 'Markdown' });
    }

    if (text.toUpperCase().startsWith('EXECUTE:')) {
        const mission = text.slice(8).trim();
        ctx.reply(`🦅 **EXECUTE (Aider):** ${mission}...`);
        const res = await jarvisExec('terminal', 'run', { mission });
        const output = res.output || res.error || JSON.stringify(res);
        await bridge.logInteraction('jarvis', `EXECUTE (Aider): ${mission} -> ${output.substring(0, 100)}`);
        return ctx.reply(`🦅 **Aider Report:**\n\`\`\`\n${output.substring(0, 4000)}\n\`\`\``, { parse_mode: 'Markdown' });
    }

    // Special prefixes
    if (text.toLowerCase().startsWith('gemini:')) {
        const promptRaw = text.slice(7).trim();
        ctx.reply('🧠 Consultando Gemini Web (Injetando Contexto Local)...');

        // Ativa a consciência total (Memos + Arquivos + Logs)
        const awarenessContext = await bridge.getFullAwareness(promptRaw);
        const res = await jarvisExec('gemini-web', 'ask', { prompt: awarenessContext });

        const reply = res.text || res.result?.text || JSON.stringify(res);
        await bridge.logInteraction('jarvis', reply);
        return ctx.reply(`🧠 **Gemini:**\n\n${reply}`, { parse_mode: 'Markdown' });
    }

    if (text.toLowerCase().startsWith('search:')) {
        const query = text.slice(7).trim();
        ctx.reply('🔍 Pesquisando no Perplexity...');
        const res = await jarvisExec('perplexity', 'telegramSearch', { query });
        await bridge.logInteraction('jarvis', res);
        return ctx.reply(res, { parse_mode: 'Markdown' });
    }

    if (text.toLowerCase().startsWith('recall:')) {
        const query = text.slice(7).trim();
        ctx.reply('🧠 Buscando na Memória Infinita (Qdrant)...');
        const awareness = await bridge.getFullAwareness(query);
        return ctx.reply(`🧠 **Contexto Recuperado:**\n\n${awareness.substring(0, 4000)}`, { parse_mode: 'Markdown' });
    }

    if (text.toUpperCase().startsWith('MISSÃO:') || text.toUpperCase().startsWith('MISSION:')) {
        const mission = text.split(':').slice(1).join(':').trim();
        ctx.reply(`🚀 **Missão Iniciada:** ${mission}\n\nAguarde, vou planejar e executar tudo no background de forma soberana...`);

        try {
            const result = await jarvisExec('mission-control', 'run', { mission });
            if (result.status === 'COMPLETED') {
                if (result.evidence) {
                    await ctx.replyWithPhoto({ source: result.evidence }, { caption: `✅ **Missão Completa!**\n\n${result.log.substring(0, 100)}...`, parse_mode: 'Markdown' });
                } else {
                    await ctx.reply(`✅ **Missão Completa!**\n\nLog:\n\`\`\`\n${result.log}\n\`\`\``, { parse_mode: 'Markdown' });
                }
            } else {
                ctx.reply(`❌ Falha na missão: ${result.error || 'Erro desconhecido'}`);
            }
        } catch (err) {
            ctx.reply(`❌ Erro no Mission Control: ${err.message}`);
        }
        return;
    }

    // 🔍 1. Tentar detectar intenção fixa (hardcoded regex)
    const intent = bridge.parseIntent(text);

    if (intent) {
        ctx.reply(`⚡ Executando: \`${intent.agent}.${intent.action}\`...`, { parse_mode: 'Markdown' });
        const result = await bridge.dispatch(intent);

        if (result.success !== false) {
            const display = typeof result.result === 'object'
                ? JSON.stringify(result.result, null, 2).substring(0, 3000)
                : String(result.result || 'OK');

            await bridge.logInteraction('jarvis', `Executou ${intent.agent}.${intent.action}: ${display}`);
            ctx.reply(`✅ **200 OK — Resultado:**\n\`\`\`\n${display}\n\`\`\``, { parse_mode: 'Markdown' });
        } else {
            ctx.reply(`❌ Erro: ${result.error || 'Falha na execução'}`);
        }
    } else {
        // 🧠 2. Fallback: Usar Gemini com consciência total do repositório
        ctx.reply('🧠 Analisando com consciência local...');
        const awarenessContext = await bridge.getFullAwareness(text);
        const res = await jarvisExec('gemini-web', 'ask', { prompt: awarenessContext });
        const reply = res.text || res.result?.text || JSON.stringify(res);
        await bridge.logInteraction('jarvis', reply);
        return ctx.reply(`🧠 **Jarvis:**\n\n${reply}`, { parse_mode: 'Markdown' });
    }
});

// ===== COMMANDS =====
bot.command('memory', async (ctx) => {
    ctx.reply('🧠 Verificando status da Memória Semântica...');
    try {
        const qdrant = await fetch('http://localhost:6333/collections/jarvis_memory');
        const data = await qdrant.json();
        ctx.reply(
            `✅ **Qdrant 200 OK**\n\n` +
            `• Coleção: \`${data.result?.name}\`\n` +
            `• Pontos (Memórias): \`${data.result?.points_count}\`\n` +
            `• Status: \`${data.result?.status}\``,
            { parse_mode: 'Markdown' }
        );
    } catch {
        ctx.reply('❌ Qdrant Offline ou não inicializado.');
    }
});

// ===== HELPERS =====
async function jarvisExec(agent, action, params) {
    try {
        const res = await fetch(`${JARVIS_API}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent, action, params })
        });
        return await res.json();
    } catch (err) {
        // Fallback: execute locally if Jarvis API is down
        try {
            const mod = await import(`../../../src/jarvis/${getModulePath(agent)}`);
            return await (mod.default || mod)[action](params);
        } catch (e2) {
            return { success: false, error: `API: ${err.message} | Local: ${e2.message}` };
        }
    }
}

function getModulePath(agent) {
    const map = {
        terminal: 'terminal/aider-bridge.mjs',
        vision: 'vision/screen-capture.mjs',
        mouse: 'mouse/xdotool-control.mjs',
        browser: 'browser/playwright-cli.mjs',
    };
    return map[agent] || agent;
}

async function fetchJarvisStatus() {
    try {
        const res = await fetch(`${JARVIS_API}/api/status`);
        return await res.json();
    } catch {
        return { status: 'offline', error: 'Jarvis API not reachable' };
    }
}

// ===== LAUNCH =====
bot.launch().then(() => {
    console.log('🦞 [OPENCLAW] Bot online! Aguardando comandos do Líder...');
    console.log(`👤 [OPENCLAW] Admin ID: ${ADMIN_ID}`);
    console.log(`📡 [OPENCLAW] Jarvis API: ${JARVIS_API}`);
    console.log(`📝 [OPENCLAW] Memos: ${Object.keys(bridge.memos).join(', ') || 'nenhum'}`);
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
