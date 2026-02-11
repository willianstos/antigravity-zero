# PRD: Fase 05 — OpenClaw Bot: Do Zero ao Estável

> **Protocolo**: MCP Taskmaster 2026 · **Prioridade**: P0 (Crítica)
> **Fonte**: Documentação oficial `docs.openclaw.ai` (fev/2026) + logs de produção (`openclaw-bot.txt`)

---

## 1. Objetivo
Refatorar a instalação atual do OpenClaw Bot para atingir **estado estável de produção local**, eliminando todos os erros de autenticação, processos zumbis e configurações incorretas. O resultado final deve ser um bot que:
- Dashboard acessível sem loop de reconexão
- Telegram respondendo mensagens corretamente
- Zero processos órfãos
- Configuração reproduzível e documentada

---

## 2. Análise de Causa Raiz (RCA)

### Bug #1: `token_missing` — Loop infinito no Dashboard (CRÍTICO)
- **Sintoma**: O Control UI tenta conectar via WebSocket sem enviar token → Gateway rejeita com `code=1008` → UI reconecta em 15s → loop eterno.
- **Causa**: O `gateway.auth.mode` é `token`, mas o navegador não tem o token salvo no `localStorage` (key: `openclaw.control.settings.v1`).
- **Solução oficial**: `openclaw dashboard` (abre a URL correta com hint de token) ou colar manualmente o token nas configurações do Control UI.

### Bug #2: Processos zumbis (`clawhub`, `system-monitor-mcp`, `playwright`)
- **Sintoma**: 5+ terminais travados há >1h consumindo RAM/CPU.
- **Causa**: Comandos lançados em sessões anteriores nunca foram terminados. O `clawhub` (deprecated) nunca resolveu; `system-monitor-mcp` ficou pendurado sem cliente; `playwright uninstall` completou mas o terminal ficou aberto.
- **Solução**: Kill all orphans + script de limpeza.

### Bug #3: Plugin `memory-core` duplicado
- **Sintoma**: `plugin CLI register skipped (memory-core): command already registered (memory)` repetido centenas de vezes.
- **Causa**: O plugin `memory-core` tenta registrar o comando `memory` que já existe. É um warning cosmético, não funcional.
- **Solução**: Ignorar (é um known issue do core). Opcionalmente configurar `logLevel` para suprimir debug.

### Bug #4: `.env` com credenciais expostas
- **Sintoma**: Tokens, senhas e API keys em texto plano no `.env`, commitado no repositório.
- **Causa**: Falha de segurança desde a Fase 01.
- **Solução**: Revogar tokens comprometidos, criar novo `.env.example` com placeholders, adicionar `.env` ao `.gitignore`.

---

## 3. Arquitetura Técnica

```
┌─────────────────────────────────────────────────────┐
│                  GATEWAY (PID 1571)                  │
│  ws://127.0.0.1:18789 · auth: token                 │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │Telegram │  │ Control  │  │  Agent (main)      │  │
│  │@ZapPRO  │  │   UI     │  │  pony-alpha 200k   │  │
│  │  bot    │  │ (Chrome) │  │  workspace: ~/ag0  │  │
│  └─────────┘  └──────────┘  └────────────────────┘  │
│                     ↑                                │
│              TOKEN REQUIRED                          │
│     (openclaw.control.settings.v1)                   │
└─────────────────────────────────────────────────────┘
```

---

## 4. Roles & Skills
- `administrador-do-sistema`: Kill processos, restart serviços, auditoria de segurança
- `zelador-do-codigo`: Limpeza de arquivos obsoletos, `.gitignore`
- `navegador-automatizado`: Validação visual do Dashboard pós-fix

---

## 5. Lista de Tarefas (Checklist Granular)

### FASE 5A — Limpeza e Triage (5 min)
- [ ] Matar todos os processos órfãos (`clawhub`, `system-monitor-mcp`, `playwright`, terminais travados)
- [ ] Validar que apenas o processo `openclaw-gateway` (PID 1571) sobrevive
- [ ] Limpar logs antigos em `/tmp/openclaw/`

### FASE 5B — Autenticação do Dashboard (3 min)
- [ ] Obter token via `openclaw config get gateway.auth.token`
- [ ] Executar `openclaw dashboard` para gerar a URL correta
- [ ] Abrir URL no Chrome com token → verificar que o Control UI conecta sem loops
- [ ] Se falhar: rodar `openclaw doctor --generate-gateway-token` e repetir

### FASE 5C — Hardening de Segurança (10 min)
- [ ] Revogar `GITHUB_TOKEN` comprometido (gerar novo no GitHub)
- [ ] Revogar `FIRECRAWL_API_KEY` (gerar nova no painel Firecrawl)
- [ ] Revogar `TELEGRAM_BOT_TOKEN` via @BotFather (gerar novo)
- [ ] Revogar `OPENROUTER_API_KEY` (gerar nova no painel OpenRouter)
- [ ] Criar `.env.example` com placeholders `{CHAVE}` para referência
- [ ] Confirmar que `.env` está no `.gitignore` (e NUNCA mais commitado)
- [ ] Limpar histórico Git das credenciais com `git filter-repo` ou BFG

### FASE 5D — Configuração Best-Practices (5 min)
- [ ] Configurar `browser.headless: true` no `openclaw.json`
- [ ] Configurar `web_search` e `web_fetch` com Brave API key (se disponível)
- [ ] Configurar `logLevel` para suprimir warnings repetidos do `memory-core`
- [ ] Validar config com `openclaw doctor`
- [ ] Executar `openclaw status --deep` → todos os checks verdes

### FASE 5E — Validação Final (5 min)
- [ ] `openclaw status` → Gateway reachable, Telegram OK
- [ ] `openclaw doctor` → 0 erros
- [ ] Dashboard `http://127.0.0.1:18789` → conectado com token
- [ ] Enviar mensagem teste no Telegram → bot responde
- [ ] `ps aux | grep -E "claw|chrome|node"` → apenas processos esperados
- [ ] Gerar relatório final em `artifacts/`

---

## 6. Critérios de Aceite
| Métrica | Alvo |
|---|---|
| Dashboard conecta sem loop | ✅ Sim |
| Telegram responde em <10s | ✅ Sim |
| Processos órfãos ativos | 0 |
| Credenciais expostas no Git | 0 |
| `openclaw doctor` erros | 0 |
| Warnings `memory-core` por minuto | <1 (suprimido via logLevel) |

---

*Assinado: Orquestrador Jarvis · 11/02/2026 04:06 BRT*
