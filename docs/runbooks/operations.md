# ANTIGRAVITY RUNBOOK (PH-01)
Version: 1.0.0
Date: 2026-02-11

## 🚨 SYSTEM SMOKE TEST
Para validar se o ambiente está soberano e pronto para uso:
`./scripts/smoke-all.sh`

Componentes validados:
- Runtime: Node.js v22 (LTS)
- Engine: OpenClaw CLI 2026
- Cache: Redis Server (Systemd)
- Config: .env Secrets

## 🦾 OPERAÇÕES COMUNS

### Iniciar o Jarvis Bot (Foreground)
`openclaw start`

### Iniciar o Jarvis Bot (Background Systemd)
`sudo systemctl start openclaw.service`
`sudo systemctl status openclaw.service`

### Atualizar Infraestrutura (Full-Auto)
`./scripts/install_ph01_master.sh`

### Ativar Modo Liberal (Desenv)
`./scripts/ativar_modo_liberal.sh`

## 🔑 GESTÃO DE CHAVES
Nunca edite chaves em PRDs. Use apenas o arquivo `.env`.
Exemplo de rotação:
1. Edite `.env`
2. `sudo systemctl restart openclaw.service`

## 🐛 TROUBLESHOOTING
- **Erro de Permissão (EACCES)**: Rode `./scripts/ativar_modo_liberal.sh` novamente.
- **Bot não conecta**: Verifique logs em `artifacts/`.
- **Node versão errada**: Rode `./scripts/install_ph01_master.sh`.
