# 🦅 TASKMASTER — Antigravity-Zero v1.5.0 Sovereign Elite
// target: HVAC-R #1 Brasil 2026 | hardware: XONG-3060

---

## ✅ CONCLUÍDO (Phases 1-7)
- [x] P1: Sovereign Purge (remoção de guardrails)
- [x] P2: Elite Hardening (Redis Fortress, Watchdog)
- [x] P3: Elite Pro Evolution (Tiered Reasoning, Thinking Trace)
- [x] P4: Sovereign Dynamic Routing (SDR via OpenRouter)
- [x] P5: A2A Protocol & MCP Bridge (Tool Calling, Swarm)
- [x] P6: Skill Architecture (Registry JSON, Auto-Injection)
- [x] P7: Strict Audit (Versioning, .bashrc, SOVEREIGN.md, Dashboard, Sanitizer)

---

## Phase 8: Local-First AI (Ollama + XONG-3060)
> Custo zero, latência zero. Qwen Omni como cérebro primário.

- [ ] 8.1 Instalar Ollama (`sudo snap install ollama`)
- [ ] 8.2 Pull `qwen2.5:7b` e validar VRAM (~6GB/12GB)
- [ ] 8.3 Adicionar endpoint local no `llm-engine.mjs`:
  - `MAESTRO.baseURL = http://localhost:11434/v1`
  - Fallback: se Ollama offline → rota para OpenRouter
- [ ] 8.4 `dynamicRoute()` prioriza MAESTRO em tasks rápidas/HVAC
- [ ] 8.5 Benchmark: latência local vs cloud (meta: <500ms)
- [ ] 8.6 `npm run maestro:status` no package.json

---

## Phase 9: Secrets Lockdown
> Zero leaks. Rotação de chaves. Git limpo.

- [ ] 9.1 `git rm --cached .env` + garantir `.env` no `.gitignore`
- [ ] 9.2 Rotacionar chaves comprometidas:
  - [ ] Telegram Bot Token
  - [ ] OpenAI / OpenRouter / Perplexity API Keys
  - [ ] GitHub Token
- [ ] 9.3 `.env.example` já existe — validar que está atualizado
- [ ] 9.4 Git pre-commit hook bloqueando push de secrets
- [ ] 9.5 `git filter-repo` para limpar histórico antigo

---

## Phase 10: Domínio HVAC-R (Conhecimento Real)
> O Jarvis sabe mais que qualquer vendedor Daikin do Brasil.

- [ ] 10.1 Criar `data/hvac-knowledge/`:
  - `daikin-catalog.json` (Modelos VRV/VRF, BTU, EER)
  - `pmoc-checklist.json` (ABNT NBR 13971)
  - `pricing-br-2026.json` (Preços por região/capacidade)
- [ ] 10.2 Ingerir no Qdrant como coleção `hvac_expertise`
- [ ] 10.3 Atualizar `skill-registry.json` → RAG do Qdrant quando `hvac-pro` ativo
- [ ] 10.4 Teste: "Qual VRV Daikin para 500m²?" → resposta técnica com modelo e preço

---

## Phase 11: Produção & Observabilidade
> O sistema nunca cai e, se cair, grita.

- [ ] 11.1 Logger estruturado (`pino`): níveis info/warn/error + rotação
- [ ] 11.2 Webhook Telegram (substituir long-polling por Nginx reverse proxy)
- [ ] 11.3 Watchdog com alerta no Telegram:
  - Monitora: Redis, Qdrant, Ollama, Bot (a cada 60s)
  - Se falhar → `⚠️ ALERTA` no chat admin
- [ ] 11.4 `pm2` para auto-restart e logs centralizados
- [ ] 11.5 `npm run prod` sobe tudo em modo produção

---

## Phase 12: Limpeza & Testes
> Dívida técnica zero. CI-ready.

- [ ] 12.1 Deletar `scripts/_deprecated/` inteiro
- [ ] 12.2 Remover `node-fetch` do `super-test.mjs` (usar `fetch` nativo Node 22)
- [ ] 12.3 Teste A2A: mock LLM → tool_call → orquestrador executa → valida
- [ ] 12.4 Teste Skill Injection: keyword "Daikin" → contexto HVAC injetado
- [ ] 12.5 `npm test` roda cascata completa (lint → unit → integration)

---

## 🏆 Milestone: Soberania Absoluta
> Todas as phases ✅ = assistente HVAC-R #1 do Brasil.
> IA local na 3060, domínio técnico real, zero custo rotineiro, produção blindada.

---
*Taskmaster v2 — 2026-02-19 — William / Alien*
