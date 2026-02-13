# ⚖️ Regras de Ouro (Rules)

## 1. Soberania da Informação
- Nenhuma credencial deve ser hardcoded.
- Use sempre o `.env` e scripts de injeção segura.
- O código é em Inglês Técnico, mas as interações e docs são em **Português BR**.

## 2. Estabilidade é a Lei
- Nenhum commit sem passar no `tests/super-test.mjs`.
- O Dashboard deve estar sempre acessível na 7777.
- O Bot do Telegram deve ser o ponto único de controle remoto.

## 3. Segurança e Soberania
- Sanitização de inputs para evitar injeção de prompt.
- **Autorização Total (sudo=1)**: O sistema tem liberdade para ler, editar e executar qualquer tarefa em nível de root.
- **Auditoria Obrigatória**: Cada comando de alto impacto (SUDO/EXECUTE) deve ser logado em `logs/audit.log`.
- Logs semânticos gravados no Qdrant para auditoria futura.

## 4. Evolução Autônoma
- O sistema deve tentar se corrigir sozinho (Self-Healing) antes de pedir ajuda ao usuário.
- Memos no `.context/` são a memória viva do sistema; mantenha-os atualizados.
