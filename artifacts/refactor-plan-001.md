# IMPLEMENTATION PLAN: Refactor Copilot (Structural Hygiene)
# Phase: PH-01-JARVIS-CORE-SYNC
# Date: 2026-02-11

## 1. Directory Structure Setup
- Action: Create necessary directories.
- Command: `mkdir -p tools infra/systemd docs/runbooks docs/drafts`

## 2. Migration & Renaming (Preserving History)
- Action: Move logic files to `tools/` and configs to `infra/`.
- Source -> Destination:
    - `scripts/mcp_taskmaster_init.mjs` -> `tools/mcp-init.mjs`
    - `scripts/smoke_test_jarvis.mjs` -> `tools/smoke-jarvis.mjs`
    - `scripts/telegram_jarvis.mjs` -> `tools/telegram-bot.mjs`
    - `infra/scripts/open-claw-bot.service` -> `infra/systemd/openclaw.service`
- Action: Archive drafts.
    - `rascunhos/*` -> `docs/drafts/`
    - `rm -rf rascunhos`

## 3. Script Updates
- Action: Update `scripts/install_ph01_master.sh` references.
- Action: Create `scripts/smoke-all.sh` wrapper.
    - Content: Call `node tools/smoke-jarvis.mjs` and check env.

## 4. Documentation
- Action: Generate `docs/PROJECT-STRUCTURE.md`.
- Action: Create `.env.example` from `.env` (sanitized).

## 5. Validation
- Action: Run `scripts/smoke-all.sh`.
- Criteria: Exit code 0, all components green.
