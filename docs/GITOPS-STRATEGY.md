# GIT-OPS STRATEGY: Phase-Based Versioning
# Context: Antigravity Zero (2026)

## 🎯 Objetivo
Automatizar o ciclo de vida do Git atrelado ao workflow `MCP Taskmaster`. Cada fase do PRD deve ser isolada, commitada, mergeada e tagueada atomicamente.

## 🔄 Fluxo de Trabalho (Workflow)

### 1. Início de Fase (Start Phase)
Quando uma fase é criada em `.agent/phases/PH-XX...`:
1. **Detectar ID da Fase**: Extrair `PH-XX-NOME` do PRD.
2. **Criar Feature Branch**: `git checkout -b feature/PH-XX-NOME`
3. **Commit Inicial**: "chore(phase): Start PH-XX [skip ci]"

### 2. Execução (During Execution)
Enquanto as tarefas do `tasks.json` são concluídas:
- Commits atômicos por tarefa concluída: `feat(PH-XX): Task 1.2 completed`
- Uso do MCP GitHub para operações de arquivo se necessário.

### 3. Fechamento de Fase (Close Phase)
Quando todas as tarefas do PRD estiverem `[x]`:
1. **Validar Status**: Garantir que `tasks.json` está 100% done.
2. **Commit Final**: "feat(PH-XX): Phase Completed"
3. **Merge**: `git checkout main && git merge feature/PH-XX-NOME`
4. **Tag**: `git tag -a "v2026.02.11-PH-XX" -m "Phase PH-XX Completed: [Tema]"`
5. **Push Relâmpago**: `git push origin main --tags`

## 🛠️ Automação (Tooling)
Criaremos uma tool `tools/git-phase-manager.mjs` para encapsular essa lógica.

### Comandos da Tool:
- `start <phase_id>`: Cria branch.
- `commit <task_id> <message>`: Commit parcial.
- `finish <phase_id> <theme>`: Merge + Tag + Push.

## 📋 Regras de Ouro
- Nunca commitar `.env`.
- Sempre rodar `smoke-all.sh` antes do `finish`.
- Tagueamento datado (`vYYYY.MM.DD-PH-XX`) para rastreabilidade cronológica.
