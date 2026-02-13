/**
 * 🦅 Sovereign STT Engine (Whisper)
 * 
 * Transcreve áudios do Telegram usando a API Whisper da OpenAI.
 */

const fs = require('fs');
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcreve um arquivo de áudio.
 * @param {string} filePath - Caminho para o arquivo local.
 * @returns {Promise<string>} - Texto transcrito.
 */
async function transcribeAudio(filePath) {
    try {
        console.log(`🎙️ Transcrevendo áudio: ${filePath}`);
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });
        return transcription.text;
    } catch (e) {
        console.error('❌ Falha no STT (Whisper):', e.message);
        return null;
    }
}

module.exports = { transcribeAudio };
