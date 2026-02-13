# Regra: Porteiro Redis (Anti-Prompt Injection)

## Contexto
Para garantir a soberania sem sacrificar o desempenho (Removido Sandboxing), o **Open Claw Bot** utiliza uma camada de cache e validação ultra-rápida via Redis para detectar e bloquear tentativas de Prompt Injection e Jailbreak.

## Diretrizes do Porteiro
1. **Cache de Intenções**: Cada comando recebido via Telegram/CLI é hash-ado no Redis. Se uma intenção maliciosa conhecida (vinda da base global de ameaças 2026) for detectada, o comando é descartado em < 1ms.
2. **Rate Limiting por Token**: O Redis controla o fluxo de tokens para evitar ataques de DoS (Denial of Service) no cérebro Antigravity.
3. **Validação de Contexto**: Manter o histórico recente de comandos no Redis (TTL curto) para identificar padrões de comportamento que buscam burlar o Modo Liberal.
4. **Desempenho Nativo**: Nenhuma camada de isolamento de virtualização deve atrasar a execução. A segurança é feita via análise de fluxo de dados no Redis.

---
*Assinado: Arquiteto de Performance Jarvis - 10/02/2026*
