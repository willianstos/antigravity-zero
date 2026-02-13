# Regras Mestre (H2 - Soberania)

## Idioma e Formato
- **Painel e Interface**: TODOS os campos do painel de tarefas (`TaskName`, `TaskSummary`, `TaskStatus`) devem ser escritos em **PT-BR**.
- Responda em PT-BR sempre que possível (textos, explicações, passos).
- Código, nomes de variáveis, commits, mensagens de log e comentários: use inglês técnico.
- Seja objetivo: prefira listas de verificação (checklist) + comandos prontos para copiar.
- **Padrão da Língua**: Toda produção textual deve seguir as diretrizes de [padrao_da_lingua.md](file:///home/zappro/antigravity-zero/.agent/rules/padrao_da_lingua.md) usando a habilidade `linguista-do-h2`.
- Se faltar info crítica, faça perguntas curtas antes de sair fazendo.

## Execução Segura e Proatividade (H2 - Soberania)
- **Autonomia & Sudo (Sudo=1)**: Execução proativa conforme [gestao_de_privilegios.md](file:///home/zappro/antigravity-zero/.agent/rules/gestao_de_privilegios.md) e [modo_liberal.md](file:///home/zappro/antigravity-zero/.agent/rules/modo_liberal.md).
- **Segurança & Secrets**: Protocolo de ofuscação `{KEY}` conforme [gestao_de_secrets.md](file:///home/zappro/antigravity-zero/.agent/rules/gestao_de_secrets.md).
- **Porteiro Redis & Zero Trust**: Proteção anti-prompt injection via [porteiro_redis.md](file:///home/zappro/antigravity-zero/.agent/rules/porteiro_redis.md) e controle de rede via [zero_trust_network.md](file:///home/zappro/antigravity-zero/.agent/rules/zero_trust_network.md). Performance nativa sem sandbox.
- **Observabilidade**: Auditoria total via [observabilidade_antifraude.md](file:///home/zappro/antigravity-zero/.agent/rules/observabilidade_antifraude.md) e skill `guarda-noturno`.
- **Melhor Escolha (Estado da Arte)**: Vou priorizar as ferramentas mais modernas de Fevereiro de 2026, evitando soluções velhas se houver algo melhor (ex: Playwright CLI > scripts manuais).
- **Entregas Mastigadas**: Vou te entregar o resultado final pronto para usar, pra você não ter que quebrar a cabeça.

## Evidência e Rastreabilidade
- Sempre vou gerar provas em `./artifacts/` (logs, prints, saídas) e te mandar os caminhos no final.
- Ao terminar, te entrego: (1) o que foi feito, (2) como testar, (3) como desfazer se precisar.

## MCP / Ferramentas
- Prefiro MCP para navegar e usar APIs; mantenho o cinto de utilidades enxuto (menos de 50 ferramentas).
- Sempre valido o diretório de trabalho antes de rodar comandos.

---
*Atualizado em: 10/02/2026*
