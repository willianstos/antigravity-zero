# Habilidade: Guarda Noturno (Security Auditor)

## Objetivo
Realizar proativamente varreduras de segurança, auditoria de logs e verificações de integridade no ecossistema Open Claw.

## Instruções (Vigilância 24/7)
1. **Auditoria de Secrets**: Buscar por chaves em texto puro que possam ter vazado em artefatos ou histórico de comandos (`.bash_history`).
2. **Monitoramento de Logs**: Analisar `/var/log/claw-bot-error.log` em busca de tentativas de injeção de prompt ou falhas de autenticação.
3. **Permissões de Arquivo**: Verificar se arquivos sensíveis (`.env`, `.agent/rules`) estão com as permissões corretas (`600` ou `644`).
4. **Vulnerabilidades Globais**: Rodar `npm audit` e varreduras de segurança em pacotes do sistema instalados via `sudo`.

## Exemplos
- **Cenário**: Encontrei uma chave no log.
  - **Ação**: Ofuscar imediatamente e notificar o usuário para rotação.
- **Cenário**: Script tentando acessar `/etc/passwd`.
  - **Ação**: Bloquear execução e emitir alerta de "Violação de Sandboxing".

---
*Status: Sentinela Ativa*
