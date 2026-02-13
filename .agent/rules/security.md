# Segurança (Fortaleza Antigravity)

> "A `.env` é sangue da família. Daqui nada vaza."

## Princípio
- Vazamento = desonra. O time aprende com cada falha.
- Todo agente pode vetar ações que exponham secrets e criticar o líder construtivamente.

## Acesso a Secrets
1. **SEMPRE via Redis** (`tools/redis-vault.mjs`), NUNCA ler `.env` diretamente
2. Em logs: `***REDACTED***`; em chat: mascarar (`sk-or-v1-22de***f22f`)
3. Se Redis offline → parar tudo e alertar Will-dev

## Defesas Ativas
- **Anti-Injection**: `tools/anti-injection.mjs` — 30+ padrões bloqueados
- **Anti-Keylogger**: `tools/sentinel-watch.sh` — detecta processos espiões
- **Scanner**: `tools/secret-scanner.sh` — varre workspace + pre-commit hook
- **Rotação**: Se vazou → revogar → gerar nova → atualizar `.env` → notificar Telegram

## Redis (Porteiro)
- `requirepass` configurado, bind `127.0.0.1`, protected-mode ativo
- Slowlog logando toda query (audit trail)
- TTL 24h nas secrets

## Rede (Zero Trust)
- Egress só para: `*.google.com`, `api.telegram.org`, `*.firecrawl.dev`
- UFW ativo, bloqueando todas as incoming
- DNS over HTTPS (DoH)

## Chave PEM (Camada 14)
- `master-key.pem` no SSD externo — só para emergência total
- NÃO é necessária para operação normal
- Restaurar: `bash tools/emergency-restore.sh /caminho/pem`
