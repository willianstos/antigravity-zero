---
description: Automação Git simplificada (Branch + Commit + Tag). Acionado por //git {feature}.
---

# Workflow: Git Feature Auto

Este workflow automatiza o ciclo de versionamento de uma feature.
Gatilho: `//git {nome-da-feature}`

## Passos

1. **Executar Tool de Automação**
   O agente deve rodar o script `tools/git-auto.mjs` passando o nome da feature fornecido pelo usuário.
   
   Exemplo:
   Se o usuário digitar `//git configurar-api`, executar:
   `node tools/git-auto.mjs configurar-api`

2. **Validar Saída**
   Verificar se o commit e a tag foram criados com sucesso.

3. **Confirmação**
   Informar ao usuário o nome da branch, a mensagem do commit (gerada aleatoriamente) e a tag criada.
