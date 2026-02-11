# 🚀 Antigravity Zero — Template LocalStack

> Template de projeto fullstack para home lab com backend (scraping + API) e frontend separados.
> Pronto para usar com OpenClaw Bot, Docker, K3s e automação DevOps.

---

## 📐 Estrutura

```
antigravity-zero/
│
├── backend/                    ← 🔧 Backend (Node.js)
│   ├── src/                    ← Código principal
│   │   ├── redis-vault.mjs     ← Vault de secrets (Redis)
│   │   ├── anti-injection.mjs  ← Filtro anti-prompt injection
│   │   ├── secret-scanner.sh   ← Scanner de vazamentos
│   │   └── sentinel-watch.sh   ← Anti-keylogger
│   ├── scraping/               ← Web scraping
│   │   └── pdf-scraper.mjs     ← Extrator de PDFs (Firecrawl + Playwright)
│   ├── api/                    ← API REST (a implementar)
│   │   └── README.md
│   └── tests/                  ← Testes do backend
│       └── README.md
│
├── frontend/                   ← 🎨 Frontend (a implementar)
│   ├── src/                    ← Código do frontend
│   ├── public/                 ← Assets estáticos
│   └── tests/                  ← Testes do frontend
│
├── tools/                      ← 🛠️ DevOps & Operação
│   ├── openclaw-fix.sh         ← Fix crash loop OpenClaw
│   ├── blindagem-total.sh      ← Aplica 14 camadas de segurança
│   ├── emergency-restore.sh    ← Break glass (requer PEM)
│   ├── pre-commit-hook.sh      ← Bloqueia commits com secrets
│   ├── env-watcher.sh          ← Monitor de acesso ao .env
│   └── secret-rotator.mjs      ← Rotação de secrets
│
├── infrastructure/             ← 🏗️ IaC (Terraform + K3s)
│   └── terraform/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars.example
│
├── docs/                       ← 📚 Documentação
│   ├── FORTALEZA-SECURITY.md   ← Manual de segurança (14 camadas)
│   ├── RUNBOOK-TROUBLESHOOTING.md ← Troubleshooting DevOps
│   ├── AGENT-TEAM-ARCHITECTURE.md ← Arquitetura multi-agente
│   └── TELEGRAM-AGENT-SETUP.md ← Setup de agentes via Telegram
│
├── .agent/                     ← 🤖 Config dos agentes
│   ├── skills/                 ← Skills especializadas
│   ├── workflows/              ← Workflows automatizados
│   ├── phases/                 ← Fases do MCP Taskmaster
│   └── rules/                  ← Regras do time
│
├── artifacts/security/         ← 🔐 Segurança
│   └── emergency/              ← Backup cifrado + PEM
│
├── SOUL.md                     ← Persona do bot
├── IDENTITY.md                 ← Identidade do bot
├── .env                        ← Secrets (protegida, imutável)
├── .env.example                ← Template de secrets
└── package.json                ← Dependências Node.js
```

---

## 🚀 Quick Start

### 1. Clonar e configurar
```bash
git clone <repo-url> meu-projeto
cd meu-projeto
cp .env.example .env
nano .env  # preencher com suas keys
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Blindar segurança
```bash
bash tools/blindagem-total.sh
```

### 4. Iniciar backend (scraping)
```bash
node backend/scraping/pdf-scraper.mjs <URL>
```

### 5. Iniciar frontend (a implementar)
```bash
cd frontend && npm run dev
```

---

## 🔐 Segurança

Este template vem com **14 camadas de proteção** pré-configuradas.
Ver: [docs/FORTALEZA-SECURITY.md](docs/FORTALEZA-SECURITY.md)

## 🤖 OpenClaw Bot

Integrado com OpenClaw para automação via Telegram.
Ver: [docs/TELEGRAM-AGENT-SETUP.md](docs/TELEGRAM-AGENT-SETUP.md)

## 🛠️ Workflows

- `/trocar-apikey` — Trocar API key do OpenRouter
- `/git-ops-sync` — Git push + sync
- `/mcp-taskmaster` — Execução de fases

---

_Template Antigravity Zero v1.0 — Will-dev, 11/02/2026_
