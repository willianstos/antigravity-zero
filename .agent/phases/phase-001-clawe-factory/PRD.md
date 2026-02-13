# PRD: Sovereign Skill Factory & Swarm Dashboard (Project Clawe) 🦅

## 1. Objetivo
Transformar o **OpenClaw Bot** em um ecossistema autônomo baseado no padrão "Clawe". O Antigravity atua como Orchestrator/PM, criando ferramentas dinâmicas em `~/.openclaw/skills/dynamic` e gerenciando tudo via um Dashboard visual.

## 2. Arquitetura Técnica
- **Orquestrador**: Agent Antigravity (Sovereign).
- **Core Bot**: OpenClaw (NPM Global).
- **Memória**: Qdrant Local (Collections: `swarm_toolbox`, `open_claw_skills`).
- **Dashboard**: `clawe-dashboard` ou `hzl-cli`.
- **Skill Factory**: Scripts em `.mjs` gerados dinamicamente em `~/.openclaw/skills/`.

## 3. Roles & Skills
- `skill-architect`: Gerador de habilidades nativas do OpenClaw.
- `arquiteto-de-skills`: Especialista em design de prompts e ferramentas.
- `mestre-qdrant`: Gestão de vetores e busca semântica.

## 4. Lista de Tarefas (Checklist Master)

### Fase 1: Fundação & Memória
- [ ] 1.1: Instalar dependências críticas (`@qdrant/js-client-rest`).
- [ ] 1.2: Criar coleção `swarm_toolbox` e `open_claw_skills` no Qdrant.
- [ ] 1.3: Implementar o script base de `skill_architect` em `~/.openclaw/skills/`.

### Fase 2: Dashboard (O "Trello" dos Agentes)
- [ ] 2.1: Instalar `hzl-cli` ou clonar `clawe-dashboard`.
- [ ] 2.2: Configurar a visualização do enxame (Kanban).
- [ ] 2.3: Implementar webhooks de status (Planning -> In Progress -> Done).

### Fase 3: Ciclo Autônomo (Skill Factory)
- [ ] 3.1: Criar diretório `~/.openclaw/skills/dynamic`.
- [ ] 3.2: Implementar validação e Sandbox de Geração de Código.
- [ ] 3.3: Primeiro ciclo de auto-evolução (Jarvis criando uma nova ferramenta).

## 🤖 Protocolo //full-auto
Este projeto segue a execução soberana.

---
*Assinado: Jarvis Sovereign - Lead Orchestrator*
