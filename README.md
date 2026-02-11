# 🦾 Open Claw - O Jarvis do Ubuntu (Elite 2026)

Bem-vindo ao centro de comando do **Open Claw Bot**. Este repositório não é apenas código; é o sistema nervoso de um orquestrador sênior projetado para dominar o Ubuntu e a infraestrutura de nuvem local com a precisão de um Jarvis (Marvel Style).

## 🎯 A Visão: "Soberania via Texto"
O Open Claw Bot atua como a interface inteligente entre você (via Telegram) e o seu servidor Ubuntu. Ele não apenas executa comandos; ele **entende e antecipa** necessidades de infraestrutura.

### O que o Jarvis faz agora:
- **Orquestração de Infra**: Sobe containers no K3s e simula AWS no LocalStack via Terraform.
- **Extração de Elite**: Realiza scraping profundo com Firecrawl e baixa PDFs com Playwright.
- **Gestão de Sistema**: Monitora logs, gerencia serviços systemd e cuida do kernel com privilégios de Superusuário Nativo.

---

## 🛠️ Stack Tecnológica (The Power Stack)

### 1. Infraestrutura (The Hardware)
- **LocalStack**: Emulação completa de AWS (S3, SQS, Lambda).
- **MinIO**: Storage S3-compatible de alta performance para armazenamento de PDFs.
- **K3s**: Kubernetes leve (Edge) rodando em máquinas virtuais KVM.
- **Terraform**: Toda a infraestrutura acima é definida como código (IaC).

### 2. Automação e Busca (The Brain)
- **Antigravity (Gemini 3.0)**: O motor de raciocínio lógico e execução agentica.
- **Firecrawl**: Scraping de elite focado em LLMs.
- **Playwright**: Automação de navegador para downloads determinísticos.

### 3. GitOps (The Heart)
- **Gitea (Local)** + **GitHub (Nuvem)**: Sincronização em tempo real para soberania de dados.
- **Argo CD**: Deploy contínuo e automático no cluster local.

---

## 📂 Guia de Orquestração do Repositório
O projeto segue o padrão de arquitetura em camadas de 2026:

```text
antigravity-zero/
├── .agent/
│   ├── rules/       # Normas e protocolos (Sudo=1, Modo Liberal)
│   ├── skills/      # Habilidades especializadas (Arquiteto, Rastreador)
│   └── workflows/   # Fluxos complexos (GitOps Sync, Busca Rápida)
├── infra/
│   ├── terraform/   # Definição da Nuvem Local
│   └── scripts/     # Serviços systemd e setups
└── scripts/         # O motor (Claw Engine, Jarvis Telegram)
```

## 🚀 Como Iniciar o "Modo Jarvis"
Para ativar as permissões totais no Ubuntu, execute:
```bash
sudo ./scripts/ativar_modo_liberal.sh
```

---
*Documentado por: Antigravity AI em 10 de Fevereiro de 2026 - Status: Em Evolução Constante*
