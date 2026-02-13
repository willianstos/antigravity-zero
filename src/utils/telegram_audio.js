/**
 * 🦅 Sovereign Audio Engine (Local TTS)
 * 
 * Módulo reutilizável para envio de notas de voz via Telegram Bot.
 * Usa motor local (Piper/Sovereign) para gerar o áudio.
 * 
 * Dependências: dotenv, axios, form-data
 */

require('dotenv').config();
const { execSync } = require('child_process');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

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
        console.log(`🎙️ [Senior-Local-TTS] Sintetizando: "${text.substring(0, 50)}..."`);

        const tempWav = path.join(__dirname, 'temp_voice.wav');
        const tempMp3 = path.join(__dirname, 'temp_voice.mp3');

        // Comando Sênior: Piper TTS (Local, Neural, Latência Ultra-baixa)
        // Usamos voz pt_BR para garantir a soberania cultural
        const piperCommand = `echo "${text}" | piper --model pt_BR-faber-medium.onnx --output_file ${tempWav}`;
        const ffmpegCommand = `ffmpeg -y -i ${tempWav} -acodec libmp3lame ${tempMp3}`;

        try {
            execSync(piperCommand);
            execSync(ffmpegCommand);
        } catch (ttsErr) {
            console.warn("⚠️ Piper não encontrado. Usando fallback espeak-ng...");
            execSync(`espeak-ng -v pt-br "${text}" -w ${tempWav}`);
            execSync(ffmpegCommand);
        }

        // 3. Preparar FormData
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('voice', fs.createReadStream(tempMp3));

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
