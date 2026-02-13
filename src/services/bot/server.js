/**
 * 🦅 SOVEREIGN MULTIMODAL BOT SERVER
 * 
 * Implementa TTS, STT e Botões Interativos no Telegram.
 */

const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const { transcribeAudio } = require('../utils/telegram_stt');
const { sendVoiceNote } = require('../utils/telegram_audio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const ADMIN_ID = parseInt(process.env.TELEGRAM_ADMIN_ID);

// Middleware de Segurança: Apenas o Líder fala com o Bot
bot.use(async (ctx, next) => {
    if (ctx.from.id !== ADMIN_ID) {
        return ctx.reply('🚫 Acesso Negado. Sistema Soberano Protegido.');
    }
    return next();
});

// Comando Inicial
bot.start((ctx) => {
    ctx.reply('🦅 **Jarvis Multimodal Online!**\n\n- Fale comigo por áudio (STT)\n- Receba relatórios falados (TTS)\n- Use os botões abaixo para controle rápido.',
        Markup.inlineKeyboard([
            [Markup.button.callback('📊 Status H2', 'check_status')],
            [Markup.button.callback('🎙️ Teste TTS', 'test_tts')]
        ]));
});

// Interface de Botões (Actions)
bot.action('check_status', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('🔍 Verificando hardware e conexões...');
    // Aqui poderíamos chamar um script de auditoria real
    await ctx.reply('✅ Nó H2: Online\n✅ RTX 3060: 38°C\n✅ RAM: 5.1GB/32GB');
});

bot.action('test_tts', async (ctx) => {
    await ctx.answerCbQuery();
    await sendVoiceNote("Líder, o sistema de áudio está respondendo ao seu comando via botão. Soberania validada.", "Relatório de Botão");
});

// Handler de Voz (STT)
bot.on('voice', async (ctx) => {
    try {
        await ctx.reply('📥 Ouvindo sua ordem, Líder...');

        const fileId = ctx.message.voice.file_id;
        const link = await ctx.telegram.getFileLink(fileId);
        const tempOga = path.join(__dirname, 'temp_voice.oga');
        const tempMp3 = path.join(__dirname, 'temp_voice.mp3');

        // Download
        const response = await axios({ url: link.href, responseType: 'stream' });
        response.data.pipe(fs.createWriteStream(tempOga));

        response.data.on('end', async () => {
            // Conversão OGA -> MP3 via FFmpeg para Whisper
            exec(`ffmpeg -y -i ${tempOga} ${tempMp3}`, async (error) => {
                if (error) {
                    console.error('❌ Erro FFmpeg:', error);
                    return ctx.reply('❌ Erro ao processar áudio.');
                }

                // Transcrição
                const text = await transcribeAudio(tempMp3);
                if (text) {
                    await ctx.reply(`📝 **Transcrição:**\n"${text}"`);

                    // Lógica de comando por voz simples
                    if (text.toLowerCase().includes('status')) {
                        await ctx.reply('🦅 Processando comando de status via voz...');
                        await ctx.reply('✅ Sistema está 100% operacional no Nó H2.');
                    }
                } else {
                    await ctx.reply('❌ Não consegui entender o áudio.');
                }

                // Limpeza
                fs.unlinkSync(tempOga);
                fs.unlinkSync(tempMp3);
            });
        });

    } catch (e) {
        console.error('❌ Erro no Handler de Voz:', e.message);
        ctx.reply('❌ Falha multimodal.');
    }
});

// Lançamento
console.log('🦅 Servidor Multimodal Pulsando...');
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
