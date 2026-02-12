---
description: Workflow para Commit, Push e Sincronização Dinâmica (Feature ou Main)
---

# Workflow: GitOps Sync (Soberano) // turbo-all

Este workflow orquestra a sincronização total entre o H2 local e a Cloud (GitHub), adaptando-se automaticamente à branch atual ou criando uma nova feature se solicitado.

## Protocolo de Sincronização Dinâmica

// turbo
1. **Verificação e Movimentação de Branch**
   Se um nome de feature for passado, o agente realiza o checkout.
   `git checkout -b {feature-name} 2>/dev/null || git checkout {feature-name} || echo "Mantendo branch atual"`

2. **Reconciliação de Estado**
   `git add . && git status`

3. **Commit Atômico com Contexto**
   Se um nome for fornecido, ele será usado no commit. Caso contrário, usa-se o timestamp de elite.
   `git commit -m "feat(sync/$(git branch --show-current)): reconciliation at $(date +%H:%M:%S) 🦅" --allow-empty`

4. **Cloud Sync (Push HEAD)**
   Faz o push da branch atual para o origin, garantindo a liberdade de movimento.
   `git push origin HEAD`

5. **Auditoria de Deployment**
   O agente confirma a branch de destino e lembra da sincronização de Secrets via Terraform.

---
*Assinado: Zelador do Código H2 - Automação Total v2.1*
