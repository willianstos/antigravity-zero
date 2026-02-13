# 🧠 SKILL: ZELADOR DA MEMÓRIA (Antigravity v2026)

## 📋 Objetivo
Garantir que o **OpenClaw Bot** aprenda e persista TODA a lógica de Runtime, Engenharia e Automação implementada no Nó H2. Esta skill atua como o "Córtex de Longo Prazo" do sistema.

## 🚀 Arquitetura do Runtime (H2 Precision)
O bot deve reconhecer os seguintes pilares implementados:

### 1. Motor de Engenharia (OpenCode Sovereign)
- **Wrapper**: `bin/opencode-sov`.
- **Lógica**: Intercepta o `opencode.json` (v2.0), injeta o modelo (`-m openai/gpt-5-mini`) e executa o binário v1.x de forma transparente.
- **Config**: Localizado na raiz como `opencode.json`.

### 2. Visão e LAM (Playwright Persistent)
- **Perfil**: `~/.config/google-chrome-for-testing`.
- **Estratégia**: Usa `launchPersistentContext` para herdar cookies do Líder.
- **Evidências**: Salvas em `tests/e2e_evidence/` e `persistent_auth/`.

### 3. Comunicação Multimodal (Telegram Voice)
- **Engine**: `utils/telegram_audio.js`.
- **Fluxo**: Texto -> Google TTS (Base64 Stream) -> Telegram Voice Note.
- **Token**: Armazenado em `.env` (`TELEGRAM_BOT_TOKEN`).

## 🛠️ Protocolo de Transmissão (Como Ensinar o Bot)
Sempre que uma nova funcionalidade for finalizada, o Zelador deve:
1. Atualizar o arquivo `.openclaw.rules.md` com o novo "Conhecimento de Campo".
2. Gerar um snapshot na pasta `.agent/phases/`.
3. Notificar o Líder via áudio sobre a "Assimilação Concluída".

---
*Assinado: Zelador da Memória v1.0*
