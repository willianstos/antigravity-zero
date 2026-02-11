---
description: Automação Git simplificada (Branch + Commit + Tag + CI Trigger). Acionado por //git {feature}.
---

# Workflow: Git Feature Auto (Senior 2026)

Este workflow orquestra todo o ciclo de vida DevOps de uma nova feature, desde a criação da branch até o disparo do CI no GitHub.
Gatilho: `//git {nome-da-feature}`

## 🚦 Fases de Execução

### 1. Preparação (Local)
O agente deve executar a tool de automação com o nome da feature:
`node tools/git-auto.mjs {feature-kebab-case}`

Isso garante:
- Criação/Checkout da branch `feature/{nome}`.
- Commit estilizado com Conventional Commits e Emojis.
- Tag datada para rastreabilidade (`vYYYY.MM.DD-...`).
- Push automático para `origin` (acionando Webhooks).

### 2. Validação Contínua (Remote)
Após o push, o GitHub Actions (`ci-smoke.yml`) será disparado.
- **Observar**: O agente deve lembrar o usuário de verificar a aba "Actions" no GitHub.
- **Secrets**: Se for a primeira execução, lembrar o usuário de configurar `GH_TOKEN` e `OPENROUTER_API_KEY` nas Settings do Repo se ainda não o fez.

### 3. Confirmação
Entregar um relatório conciso:
> 🚀 **Feature Deployed**: `feature/{nome}`
> 🔖 **Tag**: `v...`
> 🔗 **CI Status**: `https://github.com/willianstos/antigravity-zero/actions`

## 🛡️ Regras de Ouro
- Nunca commitar `.env`.
- Se o push falhar por auth, rodar `//git sync` antes de tentar novamente.
