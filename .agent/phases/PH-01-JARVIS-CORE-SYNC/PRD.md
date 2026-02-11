# PRD [PH-01]: JARVIS-CORE-SYNC & SOVEREIGNTY
//full-auto
//auto-pilot
//sudo-level:1
//performance-mode:turbo

## 💎 EXEC SUMMARY
Esta fase estabelece a conectividade mestre entre o motor **OpenClaw (Peter Steinberger)** e os cérebros **Antigravity**. É o ponto zero da soberania Jarvis no Ubuntu Desktop, focando em performance nativa e automação total via Redis e Node.js v22.

## 🏗️ TECH ARCHITECTURE
- **Runtime**: Node.js v22.x LTS (via Nodesource)
- **Engine**: OpenClaw Core (Official CLI)
- **API Motor**: OpenRouter (Model: `openrouter/pony-alpha`)
- **Cache/Queue**: Redis Server v7+
- **Interconnect**: Antigravity Gemini Tier 1 & 2
- **Interface**: Telegram Bot (Jarvis Connector)

## 🎭 ROLES & PERMISSIONS
- **Role**: `SYSTEM_INTEGRATOR_ELITE`
- **User**: `zappro` (Sudo=1)
- **Capabilities**: `RAW_BASH`, `NPM_GLOBAL`, `SYSTEMD_MANAGEMENT`

## ✅ TASK QUEUE (PHASE DETAIL)

### 📁 1. Environment & Config
- [x] Refatorar `.env` para padrão Multcloud/Multiaccount.
- [x] Injetar credenciais `{ANTIGRAVITY_PRIMARY_USER}` e `{ANTIGRAVITY_TIER2_USER}` via Protocolo `{KEY}`.
- [x] Configurar aliases de sistema para facilidade de comando Jarvis.

### 🛠️ 2. Infrastructure Hardening (Turbo Mode)
- [x] Purge: Remover Node.js v20 e resíduos de instalações quebradas.
- [x] Redis: Instalar, habilitar e validar `redis-server` e `redis-cli` (Porteiro Mode).
- [x] Node.js v22: Instalar via script Nodesource oficial para suporte ao Core 2026.
- [x] OpenClaw: Instalar CLI oficial via `npm install -g @openclaw/cli`.

### 🔑 3. Core Auth & Sync (Antigravity)
- [x] Headless Auth: Executar `openclaw login --email {ANTIGRAVITY_PRIMARY_USER}`.
- [x] Multi-Sync: Validar integração da conta Tier 2 `{ANTIGRAVITY_TIER2_USER}` no motor local.
- [x] Session Merge: Garantir persistência de cookies no Playwright nativo do OpenClaw.

### 🤖 4. Jarvis Interface & Daemon
- [x] Connector: Configurar `scripts/telegram_jarvis.mjs` com `{TELEGRAM_BOT_TOKEN}`.
- [x] Systemd: Criar, habilitar e iniciar `open-claw-bot.service` para persistência pós-reboot.
- [x] Logs: Redirecionar logs para `/home/zappro/antigravity-zero/.agent/phases/PH-01-JARVIS-CORE-SYNC/logs/`.

### 🧪 5. Validation (Smoke Test)
- [x] Smoke Test: Executar `scripts/smoke_test_jarvis.mjs` e garantir 5/5 PASS.
- [x] Remote Check: Enviar comando `/status` via Telegram e receber confirmação.

### 🧹 6. Refactor Copilot (Structural Hygiene)
- [ ] **Inventory**: Mapear anti-padrões e scripts órfãos.
- [ ] **Standardization**: Migrar para estrutura `tools/`, `scripts/`, `infra/systemd/`.
- [ ] **Consolidation**: Unificar smoke tests em `tools/smoke-core.mjs`.
- [ ] **Documentation**: Gerar `docs/PROJECT-STRUCTURE.md` e `artifacts/refactor-run-001.md`.

---
*Assinado: Jarvis Orquestrador (Antigravity Subagent) em 11/02/2026*