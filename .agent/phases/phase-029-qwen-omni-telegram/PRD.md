# PRD: QWEN OMNI & MULTIMODAL TELEGRAM (Phase 29) 🦅🎙️🧠

**Objetivo**: Integrar o modelo local **Qwen2.5-Omni-7B** (servido via vLLM) como o motor cerebral do bot Telegram, habilitando interações multimodais reais (Voz/Texto) e execução de ferramentas via MCP.

## 🧱 Arquitetura Técnica
- **LLM Engine**: vLLM rodando localmente no Nó H2 (RTX 3060).
- **Controlador**: `bot/server.js` (Telegraf).
- **Multimodalidade**: 
    - **STT**: Whisper (fallback) ou Qwen-Omni Voice.
    - **TTS**: Google TTS (via `utils/telegram_audio.js`).
- **Orquestração de Ferramentas**: MCP (Model Context Protocol) conectado ao `system-monitor` e `desktop-control`.

## 🛠️ Roles & Skills
- **@open-code-controller**: Refatoração do bot e integração MCP.
- **@administrador-do-sistema**: Gestão do lifecycle do vLLM e hardware GPU.
- **@zelador-da-memoria**: Documentar o novo workflow de áudio.

## //FULL-AUTO TASKS
[ ] **Task 29.1: Motor de Inferência H2**
    - Executar `bin/qwen-omni-launcher.sh`.
    - Validar disponibilidade do endpoint do vLLM.

[ ] **Task 29.2: Bot Multimodal v2.0**
    - Refatorar `bot/server.js` para usar o Qwen local via OpenAI API client.
    - Implementar pipeline: Áudio -> Base64 -> STT -> LLM -> TTS -> Telegram.
    - Adicionar botões interativos para ferramentas MCP.

[ ] **Task 29.3: Integração MCP Master**
    - Conectar o bot aos MCP servers locais (`system-monitor`, `github`).
    - Permitir que o bot execute comandos via botões (ex: "Status da GPU", "Git Sync").

[ ] **Task 29.4: Estabilidade & Logs**
    - Garantir que o bot e o vLLM rodem como processos daemon (nohup).
    - Criar monitor de saúde em `artifacts/health.log`.

## 📊 Critérios de Aceite
1. Bot responde perguntas usando o Qwen2.5-Omni-7B local.
2. Comandos de voz são transcritos e processados.
3. Botões interativos executam ações reais no sistema (MCP).

---
*Jarvis v15.0 - Omni-Motion Protocol*
