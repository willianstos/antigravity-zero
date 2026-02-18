# PRD: MULTIMODAL TELEGRAM INTERACTION (Phase 28) 🦅🎙️⌨️

**Objetivo**: Transformar o Bot @ZapPRO_site_bot em um assistente multimodal real. Implementar TTS (Text-to-Speech), STT (Speech-to-Text via Whisper) e Botões Interativos (Inline Keyboards) no Telegram.

## 🧱 Arquitetura de Execução
- **Framework**: `telegraf` (Node.js Telegram Bot Framework).
- **STT Engine**: OpenAI Whisper API.
- **TTS Engine**: Google TTS (já integrado no `utils/telegram_audio.js`).
- **Interação**: Inline Buttons para ações rápidas (ex: "Confirmar Checklist", "Repetir Áudio").

## 🛠️ Roles & Skills
- **@open-code-controller**: Desenvolver o núcleo do servidor do bot (`bot/main.js`).
- **@protocolo-seguranca**: Garantir que as chaves de API não vazem nos logs de voz.

## //FULL-AUTO TASKS
[ ] **Task 28.1: Install Multimodal Deps**
    - `npm install telegraf openai fluent-ffmpeg`

[ ] **Task 28.2: STT Integration (Whisper)**
    - Criar `utils/telegram_stt.js` usando a API da OpenAI para transcrever arquivos `.oga` (Telegram).

[ ] **Task 28.3: Interactive Bot Server**
    - Criar `bot/server.js`.
    - Lógica: Receber Voz -> Transcrever (STT) -> Processar -> Responder com Voz (TTS) + Botões.

[ ] **Task 28.4: Persistence & Systemd**
    - Configurar o bot para rodar em background.

## 📊 Critérios de Aceite
1. Bot responde a áudios com texto transcrito.
2. Bot envia áudios com botões interativos anexados.
3. Botões executam comandos (ex: logout, status).

---
*Jarvis v15.0 - Multimodal Protocol*
