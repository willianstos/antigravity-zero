---
description: Workflow para Commit, Push e Sincronização GitOps (Gitea + GitHub + Argo CD)
---

Este workflow automatiza o ciclo de vida do código, garantindo que as mudanças locais cheguem ao Argo CD de forma segura.

## Passos do Ciclo de Elite

1.  **Verificação de Status**
    - Roda `git status` para garantir que não há lixo no repo.

2.  **Commit Padronizado (Antigravity 2026)**
    - Adiciona mudanças e faz commit com mensagem técnica clara.
    - Ex: `git add . && git commit -m "feat(infra): add argo-cd sync patterns"`

3.  **Push Duplo (Soberania)**
    - Primeiro para o **Gitea** (Local) para deploy imediato no cluster K3s.
    - Segundo para o **GitHub** (Nuvem) para backup e auditoria.
    - `// turbo`
    - `git push gitea main && git push github main`

4.  **Sincronização Argo CD**
    - Força o refresh do Argo CD para refletir o novo estado do Git.
    - `argocd app sync open-claw-bot --force`

---
*Assinado: Zelador do Código H2 em 10/02/2026*
