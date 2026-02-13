# Antigravity Zero

> Home lab fullstack de Will-dev (H1+H2). Bot AI autônomo via OpenClaw + Telegram.

## Stack
- **Runtime:** Node.js 22+ (global), OpenClaw 2026.2.9 (global npm)
- **AI:** OpenRouter API (modelos: pony-alpha free, claude-sonnet-4 pago)
- **Canais:** Telegram (@ZapPRO_site_bot), WhatsApp
- **Infra:** Ubuntu local, Redis (vault de secrets), systemd, K3s (futuro)
- **Scraping:** Playwright CLI + Firecrawl API
- **Segurança:** 14 camadas (ver `docs/SECURITY.md`)

## Estrutura
```
backend/        → API + Scraping (Node.js)
frontend/       → Interface web (a implementar)
tools/          → DevOps: fix, blindagem, scanner, vault
docs/           → SECURITY, OPERATIONS, AGENTS
.agent/rules/   → 5 rules: core, security, architecture, style, infra-pinada
.agent/skills/  → 11 skills especializadas
.agent/workflows/ → 6 workflows automatizados
```

## Regras Críticas
1. **Secrets via Redis**, nunca ler `.env` diretamente
2. `.env` é **imutável** (chattr +i) — desbloquear só para editar
3. OpenClaw é **global npm** — não migrar para Docker/nvm sem ordem
4. Autenticação por **Telegram ID 7220607041** — único autorizado
5. **PEM no SSD externo** — só para emergência total

## Líder
- **Will-dev** (Telegram ID: 7220607041)
- Aceita críticas construtivas sobre segurança
- Autonomia total (Sudo=1) — executar sem pedir a cada passo
