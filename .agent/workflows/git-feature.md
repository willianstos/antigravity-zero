---
description: Automação Git Master Sovereign (Branch + Commit + Tag + Merge Main). Acionado por //git {feature}.
---
# Workflow: Git Feature Master Sovereign (PH-MAX) 🦅🏛️⚡

Este workflow implementa o ciclo de elite **Full-Sovereign-Sync**, movendo automaticamente o seu código da feature para a `main`, garantindo higiene total e persistência no cloud.

## Ciclo de Execução Master

// turbo-all
1. **Disparo da Tool Master**
   O agente executa o script de automação com o nome da feature (formato kebab-case).
   Este script faz: Branch -> Commit -> Push -> Merge Main -> Push Main.
   
   `node tools/git-auto.mjs {feature-name}`

2. **Verificação de Higiene**
   O script limpa automaticamente resíduos de terminal (`2k`) e gerencia os atributos de arquivo (`chattr`).

3. **Reporte Executivo**
   Apresentar o relatório simplificado para o Líder:
   > 🦅 **Sovereignty Sync**: Feature `{feature-name}` mesclada em `main`.
   > 🔖 **Tag Master**: `v...`
   > 🔄 **Status**: Local e Remoto em Sintonia Total.

---
*Assinado: Orquestrador Jarvis v10.5 - Ciclo Infinito de Soberania*
