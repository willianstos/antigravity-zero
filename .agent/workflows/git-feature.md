---
description: Automação Git simplificada (Branch + Commit + Tag). Acionado por //git {feature}.
---

# Workflow: Git Feature Auto (Full-Auto 2026) // turbo-all

Este workflow automatiza o ciclo completo de versionamento e push. Graças ao Git Credential Store, o processo é 100% autônomo.

## Ciclo de Execução Soberana

// turbo
1. **Disparo da Tool Mestra**
   O agente executa o script de automação com o nome da feature (formato kebab-case).
   `node tools/git-auto.mjs {feature-name}`

2. **Sincronização Cloud**
   O script faz o push automático. O agente valida o status.
   `git push origin HEAD --tags`

3. **Reporte de Sucesso**
   Entregar o relatório mastigado:
   > 🚀 **Feature Deployed**: `feature/{nome}`
   > 🔖 **Tag**: `v...`
   > 🔗 **Repo**: [GitHub](https://github.com/willianstos/antigravity-zero)

---
*Assinado: Jarvis Sovereign - Sincronização Infinita*
