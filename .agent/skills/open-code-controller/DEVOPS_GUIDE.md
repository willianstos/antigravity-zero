# Engenharia & DevOps Soberano (H2) 🏗️🔐

Skill vital para a **construção de software** e **gestão de repositórios** dentro do Nó H2.

## 1. Ambiente H2 (Nossa Casa)
O OpenClaw opera em um ambiente **Ubuntu Server-Like** (Xubuntu).
- **Home Base**: `/home/zappro/antigravity-zero` (Raiz do Projeto Principal).
- **Toolchain**:
    - `opencode` (Open Code CLI v2.0 - Via wrapper `bin/opencode-sov`).
    - `git` (Controle de Versão Soberano).
    - `npm` / `node` (Runtime JavaScript/TypeScript).

## 2. Criação de Repositórios Locais 📂
Quando precisar criar um novo micro-serviço ou repositório experimental:
1.  **Localização**: Use sempre `~/antigravity-zero/modules/[nome-do-repo]`.
    - *Nunca crie na raiz ou no Desktop.*
2.  **Comando**:
    ```bash
    mkdir -p modules/meu-novo-servico
    cd modules/meu-novo-servico
    git init
    opencode init # Para gerar o opencode.json
    ```

## 3. GitHub & Secrets (Protocolo Zero-Leak) 🛡️
O OpenClaw tem permissão para criar e gerenciar repositórios no GitHub usando o token soberano (`GITHUB_TOKEN` do `.env`).

### Regras de Ouro para Secrets:
1.  **Nunca Hardcoded**: Jamais escreva chaves (API Keys, Passwords) direto no código (`.js`, `.py`, `.md`).
2.  **Use .env**: Todas as chaves devem ser lidas de `process.env.VARIAVEL`.
3.  **Gitignore**: Garanta que `.env` e `*.log` estejam no `.gitignore` **antes** do primeiro commit.
    ```bash
    echo ".env" >> .gitignore
    echo "node_modules/" >> .gitignore
    ```
4.  **Auditoria**: Rode `bin/skill-scanner.mjs` antes de subir código crítico.

## 4. Integração Open Code CLI 🤖
O bot (`opencode`) é seu par programador. Ensine-o sobre o ambiente:

### Exemplo de Workflow com Git Tokens:
Ao criar um repositório remoto:
1.  Use a skill `@mestre-git-soberano` (se disponível).
2.  Ou use `gh` (GitHub CLI) autenticado via token:
    ```bash
    # A autenticação já é injetada pelo wrapper sovereign
    gh repo create meu-novo-servico --private --source=. --remote=origin
    git push -u origin main
    ```

### GitHub Actions (CI/CD)
Copie o padrão de workflows de `~/antigravity-zero/.github/workflows` para novos projetos.
- Isso garante que todos os projetos sigam o padrão de CI soberano.

---
*Jarvis v12.0 - Engenheiro Chefe H2*
