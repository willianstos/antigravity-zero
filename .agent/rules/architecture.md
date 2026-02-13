# Arquitetura do Projeto

## Estrutura
```
antigravity-zero/
├── backend/        ← API + Scraping + Security
├── frontend/       ← Interface web (a implementar)
├── tools/          ← DevOps & Operação
├── docs/           ← 3 docs: SECURITY, OPERATIONS, AGENTS
├── .agent/         ← Rules, Skills, Workflows, Phases
├── .context/       ← Overview rápido para LLMs
└── infrastructure/ ← IaC (Terraform, K3s)
```

## Padrão de Código
- Node.js 22+ com ES Modules (.mjs)
- Scripts bash para DevOps (tools/)
- Testes em `backend/tests/` e `frontend/tests/`

## Infraestrutura Pinada
- OpenClaw instalado **globalmente** via `sudo npm install -g openclaw` — NÃO ALTERAR
- Ver detalhes em `infra-pinada.md`
