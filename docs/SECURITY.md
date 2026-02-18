# 🛡️ SECURITY.md — Runbook de Segurança (CVE-2026 Edition)

## Vetores de Ataque Documentados (08/02/2026)

| CVE | Tipo | Severidade | Status |
|-----|------|-----------|--------|
| CVE-2026-25253 | RCE via `gatewayUrl` não validado | CRÍTICO | ✅ Mitigado (Bearer Token + CORS restrito) |
| CVE-2026-24763 | Command Injection via shell | ALTO | ✅ Mitigado (`sanitizeShellCommand`) |
| CVE-2026-25157 | Prompt Injection via Telegram | ALTO | ✅ Mitigado (`input-sanitizer.mjs` reescrito) |
| N/A | Indirect Prompt Injection (web) | ALTO | ✅ Mitigado (contexto `web` no sanitizer) |
| N/A | Persistent Memory Injection (Qdrant) | MÉDIO | ⚠️ Parcial (TTL de 24h no Redis Vault) |
| N/A | API Keys em plaintext | ALTO | ✅ Mitigado (Redis Vault com mascaramento) |

---

## Arquitetura de Defesa (Camadas)

```
[Telegram] → [Auth: ADMIN_ID] → [Anti-Injection: 4 camadas] → [LLM Intent]
                                                                      ↓
[Redis Vault] ←→ [Secrets TTL 24h]              [Swarm API: Bearer Token]
                                                                      ↓
                                              [Shell: sanitizeShellCommand]
```

---

## Configuração Obrigatória

Adicione ao `.env`:
```env
JARVIS_API_TOKEN=<token-aleatorio-forte-256bits>
REDIS_URL=redis://:senha@127.0.0.1:6379
```

Gerar token seguro:
```bash
openssl rand -hex 32
```

---

## Resposta a Incidentes

### Suspeita de Prompt Injection
1. Verificar logs: `grep "SECURITY" logs/audit.log`
2. Revogar sessão Qdrant: `node src/backend/src/redis-vault.mjs revoke OPENAI_API_KEY`
3. Reiniciar bot: `/restart-jarvis`

### Suspeita de RCE
1. Parar o Swarm Server imediatamente: `pkill -f swarm-server`
2. Revogar `JARVIS_API_TOKEN` e gerar novo
3. Auditar logs: `cat logs/audit.log | grep EXECUTE`

### Rotação de Chaves
```bash
# Revogar todas as secrets do vault
node src/backend/src/redis-vault.mjs revoke OPENAI_API_KEY
node src/backend/src/redis-vault.mjs revoke TELEGRAM_BOT_TOKEN
# Atualizar .env com novas chaves
# Recarregar vault
node src/backend/src/redis-vault.mjs load
```

---

## Checklist de Hardening (Executar Mensalmente)

- [ ] Rotacionar `JARVIS_API_TOKEN`
- [ ] Verificar TTL das secrets no Redis Vault
- [ ] Auditar `logs/audit.log` por comandos suspeitos
- [ ] Atualizar padrões do `input-sanitizer.mjs` com novos CVEs
- [ ] Testar autenticação do Swarm API com token inválido

---
*Última atualização: 2026-02-18 | Responsável: Jarvis Security Module*
