# 🦅 TASKMASTER — Antigravity-Zero v2026 Roadmap
// sovereign=1 | priority=max | target=HVAC-R #1 Brasil

---

## Phase 8: Local-First AI (XONG-3060 Power)
> **Meta**: Custo zero, latência zero. Qwen Omni rodando na 3060 como cérebro primário.

- [ ] 8.1 Instalar Ollama no H2 (`sudo snap install ollama`)
- [ ] 8.2 Pull do modelo `qwen2.5:7b` via Ollama
- [ ] 8.3 Validar VRAM usage com `nvidia-smi` (~6GB de 12GB)
- [ ] 8.4 Adicionar endpoint local em `llm-engine.mjs`:
  - `MAESTRO.baseURL = http://localhost:11434/v1`
  - Fallback automático para OpenRouter se Ollama offline
- [ ] 8.5 Atualizar `dynamicRoute()` para priorizar MAESTRO em tasks rápidas
- [ ] 8.6 Testar latência local vs OpenRouter (meta: <500ms local)
- [ ] 8.7 Adicionar `npm run maestro:status` no `package.json`

---

## Phase 9: Secrets & Security Hardening
> **Meta**: Zero leaks. Produção real. Rotação de chaves.

- [ ] 9.1 `git rm --cached .env` + atualizar `.gitignore`
- [ ] 9.2 Rotacionar todas as chaves expostas:
  - [ ] Telegram Bot Token
  - [ ] OpenAI API Key
  - [ ] Perplexity API Key
  - [ ] GitHub Token
  - [ ] OpenRouter API Key
- [ ] 9.3 Criar `.env.example` limpo com placeholders
- [ ] 9.4 Implementar `dotenv-vault` ou `sops` para secrets em repouso
- [ ] 9.5 Bloquear push de `.env` via git pre-commit hook
- [ ] 9.6 Auditar histórico do git para remover chaves antigas (`git filter-repo`)

---

## Phase 10: Base de Conhecimento HVAC-R (Domínio Real)
> **Meta**: O Jarvis sabe mais que qualquer vendedor Daikin do Brasil.

- [ ] 10.1 Criar `data/hvac-knowledge/` com estrutura:
  - `data/hvac-knowledge/daikin-catalog.json` (Modelos, BTU, preços)
  - `data/hvac-knowledge/pmoc-checklist.json` (ABNT NBR 13971)
  - `data/hvac-knowledge/installation-guide.md` (VRF/VRV padrões)
  - `data/hvac-knowledge/pricing-br-2026.json` (Preços por região)
- [ ] 10.2 Ingerir dados no Qdrant como coleção `hvac_expertise`
- [ ] 10.3 Atualizar `skill-registry.json` para referenciar a coleção Qdrant
- [ ] 10.4 No `runAutonomousMission`, injetar RAG do Qdrant HVAC quando skill `hvac-pro` ativo
- [ ] 10.5 Testar: perguntar "Qual o modelo VRV Daikin ideal para 500m²?" e validar resposta técnica

---

## Phase 11: Produção & Observabilidade
> **Meta**: O sistema nunca cai e, se cair, grita.

- [ ] 11.1 Substituir `console.log` por logger estruturado (`pino` ou `winston`):
  - Níveis: `info`, `warn`, `error`, `debug`
  - Rotação de arquivo em `logs/`
- [ ] 11.2 Webhook Telegram (substituir long-polling):
  - Nginx reverse proxy na porta 443
  - `bot.telegram.setWebhook(url)` em vez de `bot.launch()`
- [ ] 11.3 Health-check com alertas no Telegram:
  - Watchdog a cada 60s monitora: Redis, Qdrant, Ollama, Bot
  - Se falhar → envia `⚠️ ALERTA` no chat do admin
- [ ] 11.4 `pm2` ou `systemd` para gerenciar processos:
  - Auto-restart em crash
  - Logs centralizados via `pm2 logs`
- [ ] 11.5 Adicionar `npm run prod` que sobe tudo em modo produção

---

## Phase 12: Dashboard Elite (Painel de Comando)
> **Meta**: Visão executiva do enxame em tempo real.

- [ ] 12.1 Refatorar `clawe-dashboard` com Express + WebSocket:
  - Status dos agentes (online/offline)
  - Histórico de missões A2A com logs
  - Métricas: tokens gastos, custo estimado por modelo
- [ ] 12.2 Integrar API do Jarvis (`/api/status`, `/api/missions`)
- [ ] 12.3 Adicionar autenticação básica (JWT ou API key)
- [ ] 12.4 UI responsiva para mobile (acessar do celular em campo HVAC)

---

## Phase 13: Limpeza Final & Testes
> **Meta**: Dívida técnica ZERO. Código de produção.

- [ ] 13.1 Deletar `scripts/_deprecated/` inteiro
- [ ] 13.2 Remover `node-fetch` do `super-test.mjs` (usar `fetch` nativo Node 22)
- [ ] 13.3 Criar teste de integração A2A:
  - Mock do LLM retorna tool_call → orquestrador executa → valida resultado
- [ ] 13.4 Criar teste do Skill Injection:
  - Missão com keyword "Daikin" → validar que contexto HVAC é injetado
- [ ] 13.5 `npm run test` roda tudo em cascata (lint → unit → integration)
- [ ] 13.6 `npm run clean` mata processos zumbis e limpa cache

---

## 🏆 Milestone Final: "Soberania Absoluta"
> Quando todas as phases estiverem ✅, o Antigravity-Zero será o assistente HVAC-R #1 do Brasil.
> Rodando IA local na 3060, com conhecimento técnico real, zero custo de API para tasks rotineiras,
> e infraestrutura de produção blindada.

---
*Taskmaster criado em 2026-02-19 — William / Alien*
*Padrão: Sovereign Elite v1.5.0 | Hardware: XONG-3060 | Foco: HVAC-R Brasil 2026*
