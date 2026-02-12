/**
 * 🦅 Sovereign Audio Engine (Utils)
 * 
 * Módulo reutilizável para envio de notas de voz via Telegram Bot.
 * Usa Google TTS para gerar o áudio e a API do Telegram para envio.
 * 
 * Dependências: dotenv, google-tts-api, axios, form-data
 */

require('dotenv').config();
const { getAudioUrl } = require('google-tts-api');
const axios = require('axios');
const FormData = require('form-data');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_ADMIN_ID;

/**
 * Envia uma mensagem de voz para o Líder.
 * @param {string} text - O texto a ser falado pelo Bot.
 * @param {string} caption - Legenda opcional para a mensagem.
 */
async function sendVoiceNote(text, caption = '🔊 Audio Report') {
    if (!TELEGRAM_TOKEN || !CHAT_ID) {
        console.error('❌ Credenciais Telegram ausentes (Utils).');
        return false;
    }

    try {
        console.log(`🎙️ Gerando Áudio: "${text.substring(0, 50)}..."`);

        // 1. Obter URL do áudio (Google TTS)
        // Usar host alternativo se o principal falhar? Por enquanto translate.google.com é estável.
        const url = getAudioUrl(text, {
            lang: 'pt-BR',
            slow: false,
            host: 'https://translate.google.com',
        });

        // 2. Baixar stream
        const audioResponse = await axios.get(url, { responseType: 'stream' });

        // 3. Preparar FormData
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('voice', audioResponse.data, {
            filename: 'report.mp3',
            contentType: 'audio/mpeg',
        });

        // Formatar caption com negrito se possível
        form.append('caption', `🦅 **${caption}**`);
        form.append('parse_mode', 'Markdown');

        // 4. Enviar
        console.log('📤 Enviando Voice Note...');
        const tgResponse = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendVoice`,
            form,
            { headers: form.getHeaders() }
        );

        if (tgResponse.data.ok) {
            console.log('✅ Áudio enviado com sucesso!');
            return true;
        } else {
            console.error('❌ Erro API Telegram:', tgResponse.data);
            return false;
        }

    } catch (e) {
        console.error('❌ Falha no Audio Engine:', e.message);
        return false;
    }
}

module.exports = { sendVoiceNote };
