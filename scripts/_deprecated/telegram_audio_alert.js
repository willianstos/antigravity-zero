// 🦅 SOVEREIGN AUDIO ALERT (Base64/Voice)
// Envia notificação de voz para o Líder via Telegram
// Usando Google TTS (Node.js) para evitar dependência de espeak

require('dotenv').config();
const { getAudioUrl } = require('google-tts-api');
const axios = require('axios');
const FormData = require('form-data');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_ADMIN_ID;

if (!TELEGRAM_TOKEN || !CHAT_ID) {
    console.error('❌ Credenciais Telegram ausentes.');
    process.exit(1);
}

const TEXT = "Líder, aqui é o Jarvis. O Nó H2 está operando com soberania total. Sistema de áudio validado e pronto para combate.";

(async () => {
    try {
        console.log('🎙️ Gerando Áudio (PT-BR)...');

        // 1. Obter URL do áudio (Google TTS)
        const url = getAudioUrl(TEXT, {
            lang: 'pt-BR',
            slow: false,
            host: 'https://translate.google.com',
        });

        console.log(`🔗 URL: ${url}`);

        // 2. Baixar o arquivo de áudio (Buffer)
        const audioResponse = await axios.get(url, { responseType: 'stream' });

        // 3. Enviar para Telegram (sendVoice)
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('voice', audioResponse.data, {
            filename: 'sovereign_alert.mp3',
            contentType: 'audio/mpeg',
        });
        form.append('caption', '🦅 **Sovereign Alert**: Audio Reporting System Online.');
        form.append('parse_mode', 'Markdown');

        console.log('📤 Enviando Voice Note...');
        const tgResponse = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendVoice`,
            form,
            { headers: form.getHeaders() }
        );

        if (tgResponse.data.ok) {
            console.log('✅ Áudio enviado com sucesso!');
        } else {
            console.error('❌ Erro Telegram:', tgResponse.data);
        }

    } catch (e) {
        console.error('❌ Falha:', e.message);
        if (e.response) console.error('Response:', e.response.data);
    }
})();
