# PRD — Phase 100: Opus 4.6 Rewrite (Antigravity-Zero)
# //full-auto | sudo=1

---

## 1. Objetivo

Reescrever o repositório `antigravity-zero` de um "Hello World com scripts avulsos" para uma **Plataforma Jarvis Desktop Controller** — um sistema autônomo que:

1. **Controla o Terminal Ubuntu** via AIDER (AI pair programming open-source)
2. **Enxerga o Monitor** via screenshot/OCR (Vision Cortex)
3. **Controla o Mouse** via browser-use framework
4. **Controla o Navegador** via Playwright CLI
5. **Mantém o OpenClaw Bot estável** (Telegram + Gemini — ZERO mudanças no core)
6. **Infra profissional**: LocalStack + Terraform + MinIO S3 com backend remoto

---

## 2. Hardware Spec (Home Lab H2)

| Componente | Spec |
|-----------|------|
| CPU | AMD Ryzen 5 5600X (12 threads) |
| RAM | 32GB DDR4 |
| GPU | NVIDIA RTX 3060 12GB VRAM |
| Storage | NVMe Gen3 500GB (329GB livres) |
| OS | Xubuntu 24.04 LTS |
| Node | v22.22.0 |
| Python | 3.12.3 |
| Terraform | v1.14.3 |
| Docker | Running (LocalStack, MinIO, Qdrant) |

---

## 3. Arquitetura Técnica

```
antigravity-zero/
├── .agent/                          # AI Agent config (PRESERVAR)
│   ├── phases/phase-100-opus/       # ESTA FASE
│   ├── skills/                      # PRESERVAR (refinar)
│   └── workflows/                   # PRESERVAR (refinar)
├── .github/workflows/               # CI/CD (PRESERVAR)
├── src/
│   ├── core/                        # OpenClaw Bot (INTOCÁVEL)
│   │   ├── telegram-bot.js          # Telegraf handler
│   │   ├── gemini-bridge.js         # API Gemini
│   │   └── qdrant-memory.js         # Memória vetorial
│   ├── jarvis/                      # 🆕 Jarvis Desktop Controller
│   │   ├── terminal/                # AIDER integration
│   │   │   ├── aider-bridge.mjs     # AIDER subprocess manager
│   │   │   └── command-executor.mjs # Safe shell execution
│   │   ├── vision/                  # Screen capture + OCR
│   │   │   ├── screen-capture.mjs   # Screenshot via scrot/maim
│   │   │   └── ocr-engine.mjs      # Tesseract OCR pipeline
│   │   ├── mouse/                   # Desktop automation
│   │   │   ├── browser-use.mjs      # browser-use framework
│   │   │   └── xdotool-control.mjs  # X11 mouse/keyboard
│   │   ├── browser/                 # Web automation
│   │   │   ├── playwright-cli.mjs   # Playwright controller
│   │   │   └── page-analyzer.mjs    # DOM analysis
│   │   └── orchestrator.mjs         # Jarvis main loop
│   └── utils/                       # Shared utilities
│       ├── logger.mjs               # Structured logging
│       └── config.mjs               # Env config loader
├── infra/
│   ├── docker-compose.yml           # Stack principal (refatorado)
│   ├── terraform/
│   │   ├── main.tf                  # LocalStack + MinIO resources
│   │   ├── terraform.tf             # Backend S3 (MinIO)
│   │   ├── variables.tf             # Parametrização
│   │   ├── outputs.tf               # Outputs
│   │   └── modules/
│   │       ├── localstack/          # SQS, Lambda, DynamoDB
│   │       └── minio/               # Buckets S3
│   └── monitoring/                  # Grafana (PRESERVAR)
├── scripts/
│   ├── bootstrap.sh                 # Setup completo do ambiente
│   ├── health-check.sh              # Health check unificado
│   └── maintenance/                 # Manutenção
├── tests/
│   ├── smoke/                       # Smoke tests
│   └── integration/                 # Integration tests
├── docs/
│   ├── ARCHITECTURE.md              # Este documento expandido
│   └── RUNBOOKS.md                  # Procedures operacionais
├── package.json                     # Refatorado (nome, scripts, deps)
├── README.md                        # Profissional
├── .env                             # PRESERVAR (secrets)
└── .gitignore                       # Atualizado
```

---

## 4. Roles & Skills Ativadas

| Role | Skill | Missão |
|------|-------|--------|
| DevOps Sênior | `arquiteto-de-nuvem` | Terraform + Docker |
| SysAdmin | `administrador-do-sistema` | Instalações, sudo |
| Infra Generator | `template-de-infra` | Templates TF/K3s |
| Browser Agent | `navegador-automatizado` | Playwright |

---

## 5. Regras de Ouro

1. **🔒 OpenClaw Bot = INTOCÁVEL** — Apenas mover para `src/core/`, sem alterar lógica
2. **🗑️ Desinstalar OpenCode CLI** — Substituir por AIDER
3. **📦 28 phases antigas = ARQUIVO MORTO** — Mover para `.agent/phases/_legacy/`
4. **🧹 52 scripts de /bin = AUDITORIA** — Manter só os úteis, mover para `scripts/`
5. **🔧 Terraform = Backend MinIO** — State remoto real, não local
6. **🐳 Docker = Stack unificado** — Um compose com tudo

---

## 6. Lista de Tarefas

### FASE A: Limpeza e Reorganização (Housekeeping)
- [x] T-001: Arquivar 28 phases legadas em `_legacy/`
- [x] T-002: Auditar e limpar `/bin` (52→~10 scripts úteis)
- [x] T-003: Auditar e limpar `/tools` (24→~5 ferramentas úteis)
- [x] T-004: Mover scripts legados para `scripts/_deprecated/`
- [x] T-005: Limpar `opencode.json`, `opencode.sov.json`
- [x] T-006: Desinstalar OpenCode CLI globalmente

### FASE B: Infra Profissional (Terraform + Docker)
- [x] T-007: Reescrever `docker-compose.yml` unificado
- [x] T-008: Configurar MinIO bucket `terraform-state`
- [x] T-009: Reescrever `terraform.tf` com backend S3 (MinIO)
- [x] T-010: Criar módulo TF `modules/localstack` (SQS queues)
- [x] T-011: Criar módulo TF `modules/minio` (buckets)
- [ ] T-012: Terraform init + plan + apply
- [x] T-013: Health check da infra completa (bootstrap-stability.mjs)

### FASE C: Jarvis Desktop Controller
- [x] T-014: Instalar AIDER via pip
- [x] T-015: Instalar dependências de visão (scrot, tesseract, xdotool)
- [x] T-016: Criar `src/jarvis/terminal/aider-bridge.mjs`
- [x] T-017: Criar `src/jarvis/terminal/command-executor.mjs`
- [x] T-018: Criar `src/jarvis/vision/screen-capture.mjs`
- [x] T-019: Criar `src/jarvis/vision/ocr-engine.mjs`
- [x] T-020: Criar `src/jarvis/mouse/xdotool-control.mjs`
- [x] T-021: Criar `src/jarvis/browser/playwright-cli.mjs`
- [x] T-022: Criar `src/jarvis/orchestrator.mjs`

### FASE D: Packaging & Docs
- [ ] T-023: Reescrever `package.json` profissional
- [x] T-024: Reescrever `README.md` premium
- [x] T-025: Atualizar `.gitignore` completo
- [x] T-026: Smoke test end-to-end (super-test.mjs)
- [ ] T-027: Commit + Tag v1.0.0-opus
