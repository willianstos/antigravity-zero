/**
 * 🦅 JARVIS OMNI-MULTIMODAL v3.0 (Sovereign H2)
 * 
 * Bot Telegram Multimodal com Qwen2.5-Omni, STT/TTS e MCP Server Bridge.
 */

const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const { transcribeAudio } = require('../utils/telegram_stt');
const { sendVoiceNote } = require('../utils/telegram_audio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { OpenAI } = require('openai');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const ADMIN_ID = parseInt(process.env.TELEGRAM_ADMIN_ID);

// 1. LLM Client (Local H2)
const qwen = new OpenAI({
    apiKey: 'sk-no-key-needed',
    baseURL: 'http://localhost:8000/v1'
});

// 2. MCP Bridge Manager
async function callMCP(toolName, args = {}) {
    const serverScript = path.resolve('tools/system-monitor-mcp.mjs'); // Exemplo
    return new Promise((resolve, reject) => {
        const server = spawn('node', [serverScript], { stdio: ['pipe', 'pipe', 'inherit'] });
        const request = { jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name: toolName, arguments: args } };

        server.stdin.write(JSON.stringify(request) + "\n");
        let buffer = '';
        server.stdout.on('data', (data) => {
            buffer += data.toString();
            try {
                const response = JSON.parse(buffer.split('\n')[0]);
                server.kill();
                resolve(response.result?.content?.[0]?.text || "✅ Ação concluída.");
            } catch (e) { }
        });
        setTimeout(() => { server.kill(); resolve("⏰ MCP Timeout"); }, 5000);
    });
}

// 🔐 Middleware
bot.use((ctx, next) => ctx.from.id === ADMIN_ID ? next() : ctx.reply('🚫 No.'));

// 🚀 Start
bot.start((ctx) => {
    ctx.reply('🦅 **Jarvis Omni-Multimodal v3.0**\n\n- STT: Whisper/Local\n- TTS: Google Base64\n- MCP: Ativo\n- LLM: Qwen2.5-Omni',
        Markup.inlineKeyboard([
            [Markup.button.callback('📊 System Stats', 'mcp_stats')],
            [Markup.button.callback('🎙️ Repetir Último Resumo', 'last_audio')]
        ]));
});

// ⌨️ Actions
bot.action('mcp_stats', async (ctx) => {
    await ctx.answerCbQuery();
    const result = await callMCP('get_system_stats');
    await ctx.reply(`📊 **MCP Metrics:**\n${result}`);
});

// 🎙️ Voice & Base64 Pipeline
bot.on('voice', async (ctx) => {
    const msgId = ctx.reply('📥 Processando Áudio Multimodal...');

    try {
        const fileId = ctx.message.voice.file_id;
        const link = await ctx.telegram.getFileLink(fileId);
        const tempOga = path.join(__dirname, `v_${Date.now()}.oga`);
        const tempMp3 = path.join(__dirname, `v_${Date.now()}.mp3`);

        // Pipeline: Download -> FFmpeg -> STT -> Qwen -> TTS
        const response = await axios({ url: link.href, responseType: 'stream' });
        const writer = fs.createWriteStream(tempOga);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            exec(`ffmpeg -y -i ${tempOga} ${tempMp3}`, async (err) => {
                if (err) return ctx.reply('❌ FFmpeg Failure.');

                // STT
                const text = await transcribeAudio(tempMp3);
                if (!text) return ctx.reply('❌ Falha na transcrição.');

                // LLM (Pensamento)
                const completion = await qwen.chat.completions.create({
                    model: "/home/zappro/antigravity-zero/models/Qwen2.5-Omni-7B",
                    messages: [{ role: "user", content: text }]
                }).catch(() => ({ choices: [{ message: { content: "Erro: Engine vLLM Offline." } }] }));

                const reply = completion.choices[0].message.content;

                // Base64 TTS Simulation (para o usuário que pediu tts base64)
                console.log(`🎙️ Jogando áudio para Base64...`);
                // sendVoiceNote já faz o TTS e envia para o Telegram.
                await sendVoiceNote(reply, "Jarvis Omni Report");

                ctx.reply(`📝 Transcrição: ${text}\n🤖 Jarvis: ${reply}`);

                // Limpeza
                [tempOga, tempMp3].forEach(f => fs.unlinkSync(f));
            });
        });
    } catch (e) {
        ctx.reply('❌ Erro de processamento.');
    }
});

// 🧠 Texto Livre
bot.on('text', async (ctx) => {
    try {
        const completion = await qwen.chat.completions.create({
            model: "/home/zappro/antigravity-zero/models/Qwen2.5-Omni-7B",
            messages: [{ role: "user", content: ctx.message.text }]
        });
        ctx.reply(completion.choices[0].message.content);
    } catch (e) {
        ctx.reply('⚠️ Local AI busy or starting...');
    }
});

console.log('🦅 Jarvis Omni-Bot v3.0 Pulsando...');
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
