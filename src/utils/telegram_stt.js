/**
 * 🦅 Sovereign STT Engine (Faster-Whisper Local)
 * 
 * Transcreve áudios do Telegram localmente no Nó H2.
 * Zero latência de rede, zero custo de API, 100% Soberano.
 */
const { execSync } = require('child_process');
const fs = require('fs');
require('dotenv').config();

async function transcribeAudio(filePath) {
    try {
        console.log(`🎙️ [Senior-Local-STT] Transcrevendo: ${filePath}`);

        // Comando Sênior: Executa faster-whisper local via CLI ou script python wrapper
        // Nota: O modelo 'small' ou 'base' é ideal para o Nó H2 (3060) em PT-BR
        const command = `../venv/bin/python3 -c "
from faster_whisper import WhisperModel
model = WhisperModel('base', device='cuda', compute_type='float16')
segments, info = model.transcribe('${filePath}', language='pt')
print(' '.join([s.text for s in segments]))
"`;

        const transcription = execSync(command).toString().trim();
        return transcription;
    } catch (e) {
        console.error('❌ Falha no Local STT (Faster-Whisper):', e.message);
        return null;
    }
}

module.exports = { transcribeAudio };
