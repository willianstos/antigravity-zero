---
description: Ciclo de Auto-Evolução do Jarvis (Programação + Infra + Git)
---

# /self-evolve — Protocolo de Evolução Recursiva

Este workflow permite que o Jarvis analise uma necessidade, altere seu próprio código, valide via testes e faça o deploy/commit sem intervenção humana.

## Gatilhos
- Comando via Telegram: `EXECUTE: Melhore [funcionalidade/infra]`
- Falha recorrente detectada no `logs/audit.log`

## Passos (Full-Auto)

### 1. Pesquisa e Design (Recon)
O Jarvis usa o Perplexity e o Gemini para pesquisar as melhores práticas de 2026 para a demanda solicitada.
```bash
node scripts/research-task.mjs "{demanda}"
```

### 2. Alteração de Código (The Brain)
Usa o Aider para aplicar as mudanças diretamente no diretório `src/` ou `infra/`.
```bash
aider --message "Refatore o sistema para implementar {demanda}. Siga as RULES.md." src/ infra/
```

### 3. Validação de Estabilidade (The Guardrail)
Roda o Super-Test. Se falhar, o Jarvis reverte a alteração ou pede ao Aider para corrigir o erro.
```bash
npm run audit
```

### 4. Deploy de Infra (The Muscle)
Se houver mudanças em `infra/terraform`, executa o apply automaticamente.
```bash
npm run tf:apply
```

### 5. Persistência de Soberania (The Memory)
Faz o commit, gera a tag de versão e dá o push no histórico purificado.
```bash
git add -A && git commit -m "feat(evolve): autonomous enhancement - {demanda} 🦅" && git push origin main
```
