# GITHUB ACTIONS & MCP TASKMASTER 2026
## The "Silent Orchestrator" Pattern

### 🧠 Conceito
Em vez de depender de scripts locais manuais, elevamos a automação para o nível **CI/CD Nativo**. O MCP Taskmaster gera não apenas código, mas a **própria pipeline que testa e deploya esse código**.

### 🏗️ Arquitetura de Workflows (.github/workflows)
O padrão sênior 2026 exige workflows modulares e reutilizáveis, com **Secrets Management** rigoroso.

#### 1. Estrutura de Diretórios
```text
.github/
  workflows/
    ci-pr-validation.yml   # Validação rápida de PRs via MCP
    cd-deploy-prod.yml     # Deploy contínuo supervisionado
    ops-rotation.yml       # Rotação de chaves automática
```

#### 2. Segredo do Sucesso: Dynamic Matrices & MCP Injection
O MCP Server pode injetar contextos dinâmicos dentro do `matrix` do GitHub Actions via JSON output, permitindo que um único workflow se adapte a N cenários.

### 🔐 Gestão de Secrets (Protocolo {KEY})
Conforme `@.agent/rules/gestao_de_secrets.md`:
- **NUNCA** commitar `.env`.
- **SEMPRE** usar `${{ secrets.OPENCLAW_API_KEY }}` no YAML.
- **MCP Action**: O servidor MCP pode ter uma tool `sync_secrets` que lê do `.env` local (seguro) e envia para o GitHub Secrets via API (criptografado), garantindo paridade Dev/Prod sem expor nada.

### 🤖 Exemplo: Workflow de Validação Híbrida
```yaml
name: "Antigravity CI: MCP Validation"
on: [push, workflow_dispatch]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      - name: Install MCP SDK
        run: npm ci
        
      - name: Run Core Suite
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}  # {KEY}
        run: |
          node tools/smoke-core.mjs
```

### 🚀 Próximo Nível: "Self-Mutating Workflows"
O Jarvis pode criar PRs que alteram os próprios workflows para se adaptar a novas fases do PRD.
Ex: Fase 2 exige Docker? O Jarvis cria `docker-publish.yml` automaticamente e commita.

---
*Recomendação*: Implementar `ci-smoke.yml` agora para garantir que todo commit passe pelo `smoke-core.mjs` no GitHub Runners.
