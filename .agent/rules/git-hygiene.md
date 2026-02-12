# 🦅 Regras de Higiene Git & Filtro de Secrets (Soberana 2026)

Este documento define as regras inegociáveis para o gerenciamento de código no ecossistema Antigravity.

## 1. O Dogma do .gitignore
- **Blindagem Total:** O arquivo `.gitignore` deve permanecer em modo imutável (`sudo chattr +i`).
- **Padrão Zero-Trust:** Nenhum arquivo de configuração (`.env`, `.json`, `.tfvars`) deve ser commitado.
- **Limpeza Compulsiva:** Pastas de build (`dist/`, `node_modules/`, `venv/`) são proibidas no repositório.

## 2. O Protocolo de Filtro (Anti-Leak)
- **Scanner Obrigatório:** Todo commit deve passar pelo scanner de secrets via `tools/git-auto.mjs` ou hooks locais.
- **Git Filter-Repo:** Se uma secret for detectada no histórico, deve-se usar as ferramentas de expurgo (como `git filter-repo` ou `BFG Repo-Cleaner`) para apagar o rastro permanentemente antes de qualquer push público.
- **Placeholder:** Ao criar exemplos, use sempre `sk-proj-XXXXX`, `ghp_XXXXX` ou `{chave}`.

## 3. Fluxo de Trabalho (Pipeline v3.0)
- **Feature Branches:** Todo trabalho começa em uma branch isolada.
- **Sync Constante:** Use o workflow `@/git-ops-sync` para garantir que o H2 e o GitHub estejam alinhados.
- **Mensagens Técnicas:** Mensagens de commit devem seguir o padrão `feat(escopo): descrição 🦅`.

## 4. Auditoria Contínua
- O Jarvis deve rodar periodicamente:
  `git log -p | grep -E "sk-proj-|ghp_|AIzaSy"`
  Para garantir que nenhum "fantasma" escapou para o histórico.

---
*Assinado: Jarvis Sovereign - Zelador do Código H2*
