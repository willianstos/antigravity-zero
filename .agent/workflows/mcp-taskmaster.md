---
description: Workflow MCP Taskmaster para criação de fases, PRD.md e execução full-auto.
---

Este workflow implementa o padrão de elite "MCP Taskmaster 2026", decompondo o projeto em fases autônomas com memória persistente e execução em lote.

## 🏗️ Estrutura de Fase
Sempre que uma nova fase for iniciada, crie a seguinte estrutura:
`.agent/phases/phase-[ID]-[nome-da-fase]/`
- `PRD.md`: Documento de Requisitos do Produto (Arquitetura, Roles, Tasks).
- `tasks.json`: Memória de estado para o MCP server.

## 📝 Padrão PRD.md (Phase Specific)
O arquivo `PRD.md` dentro da fase deve conter:
1. **Objetivo**: O que esta fase entrega.
2. **Arquitetura Técnica**: Desenho da solução (LocalStack, K3s, etc).
3. **Roles & Skills**: Quais habilidades do Antigravity serão usadas (ex: `arquiteto-de-nuvem`).
4. **Lista de Tarefas**: Checklist [ ] granular para o agente seguir.

## 🤖 Protocolo //full-auto
Quando a flag `//full-auto` for detectada no topo do arquivo da fase ou no comando do usuário:
1. **Autonomia Máxima**: O agente executará todos os passos da `tasks.json` sequencialmente.
2. **SafeToAutoRun**: Comandos de `run_command` dentro deste fluxo devem ter `SafeToAutoRun: true` para ignorar aprovação manual entre sub-tasks.
3. **Logs**: Cada passo deve gerar um snapshot em `.agent/phases/phase-[ID]/logs/`.

## 🛠️ Como Iniciar
1. Use o comando: `Jarvis, inicie a fase [Nome] no padrão Taskmaster`.
2. O agente criará a pasta e o `PRD.md` base.
3. Se o usuário adicionar `//full-auto`, o agente assume o controle total até o fim da lista.

---
*Assinado: Orquestrador Jarvis em 10/02/2026*
