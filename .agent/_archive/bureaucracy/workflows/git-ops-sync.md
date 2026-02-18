---
description: Workflow GitOps Pipeline (Soberano): Commit + Push + Auto-Merge Main
---

# Workflow: GitOps Pipeline (Soberano) // turbo-all

Este workflow orquestra o ciclo completo de vida do código: desde a criação da feature até a entrega final na branch `main` e sincronização Cloud.

## Protocolo de Pipeline Total

// turbo
1. **Iniciação de Feature** (Opcional)
   Se um nome for fornecido, o agente cria/troca para a branch.
   `git checkout -b {feature-name} 2>/dev/null || git checkout {feature-name} || echo "Operando na branch atual: $(git branch --show-current)"`

2. **Reconciliação e Commit**
   `sudo chattr -i .gitignore 2>/dev/null; git add . && git commit -m "feat($(git branch --show-current)): automatic synchronization 🦅" --allow-empty`

3. **Push de Feature**
   Sincroniza a branch de trabalho com o GitHub.
   `git push origin $(git branch --show-current)`

4. **Merge Soberano em Main**
   Se não estivermos na main, funde o trabalho no tronco principal e limpa o terreno.
   `CURRENT_BRANCH=$(git branch --show-current); if [ "$CURRENT_BRANCH" != "main" ]; then git checkout main && git merge $CURRENT_BRANCH && git push origin main && git checkout $CURRENT_BRANCH; fi`

5. **Auditoria de Estado**
   Garante que o `.gitignore` volte a ser imutável.
   `sudo chattr +i .gitignore 2>/dev/null; echo "✅ Ciclo Completo: Feature -> Main -> Cloud Sincronizados!"`

---
*Assinado: Zelador do Código H2 - Automação Total v3.0 (Full-Pipeline)*
