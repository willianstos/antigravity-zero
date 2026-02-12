# PRD: HVAC AUDIO REPORT INTEGRATION (Phase 27) 🦅🎙️🛠️

**Objetivo**: Integrar a capacidade de AUDIO REPORT (Base64/TTS) na skill `hvac-workflow`. O Bot deve ser capaz de finalizar um checklist técnico e enviar uma nota de voz automática para o Líder confirmando a conclusão.

## 🧱 Arquitetura de Execução
- **Agente**: OpenClaw (Engenheiro Soberano).
- **Audio Engine**: Google TTS (Node.js) -> Telegram Voice Note.
- **Trigger**: Script de finalização de checklist.

## 🛠️ Roles & Skills
- **@open-code-controller**: Criar o script de automação (`modules/hvac/complete_checklist.js`).
- **@administrador-do-sistema**: Garantir que dependências de áudio estejam instaladas.

## //FULL-AUTO TASKS
[ ] **Task 27.1: Audio Module Refactor**
    - Refatorar `telegram_audio_alert.js` para ser um módulo reutilizável (`utils/telegram_audio.js`).
    - Exportar função `sendVoiceNote(text)`.

[ ] **Task 27.2: HVAC Automation Script**
    - Criar `modules/hvac/complete_checklist.js`.
    - Simular a lógica de "Checklist Completo" (ex: ler um JSON de status).
    - Gerar texto dinâmico: "Líder, checklist de instalação da unidade [MODELO] finalizado com sucesso. Dados sincronizados."
    - Invocar `sendVoiceNote(text)`.

[ ] **Task 27.3: E2E Audio Test**
    - Executar `modules/hvac/complete_checklist.js` simulando uma instalação real.
    - Validar recebimento de áudio no Telegram.

## 📊 Critérios de Aceite
1. Módulo `utils/telegram_audio.js` criado e funcional.
2. Script de checklist envia áudio dinâmico.
3. Líder recebe nota de voz "Checklist Finalizado" no Telegram.

---
*Jarvis v15.0 - Audio Integration Protocol*
