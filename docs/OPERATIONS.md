# 🛠️ Operações & DevOps

> Runbook de troubleshooting, CI/CD e GitOps para o home lab H1+H2.

---

## 🔥 Troubleshooting Rápido

### OpenClaw em Crash Loop
```bash
bash tools/openclaw-fix.sh
```

Ou manual:
```bash
sudo kill -9 $(sudo lsof -ti :18789)    # mata zumbi
openclaw gateway stop                     # para gateway
sleep 2
sudo systemctl restart openclaw.service   # reinicia limpo
```

### Bot não responde no Telegram
```bash
sudo systemctl restart openclaw.service
sudo journalctl -u openclaw.service -n 20 --no-pager
```

### Redis offline
```bash
sudo systemctl start redis-server
redis-cli -a antigravity-fortress-2026 ping   # → PONG
```

### .env está imutável (não consigo editar)
```bash
sudo chattr -i .env && nano .env && sudo chattr +i .env
```

### Rate Limit do OpenRouter
```bash
# Trocar modelo (ver /trocar-apikey workflow)
sudo chattr -i .env
sed -i "s|OPENROUTER_MODEL=.*|OPENROUTER_MODEL=\"google/gemini-2.5-flash\"|" .env
sudo chattr +i .env
sudo systemctl restart openclaw.service
```

### Pre-commit bloqueando commit legítimo
```bash
git commit --no-verify -m "bypass guardião"
```

---

## 📋 Health Check Diário

```bash
sudo systemctl status openclaw.service --no-pager | head -5
redis-cli -a antigravity-fortress-2026 ping
bash tools/sentinel-watch.sh
node tools/redis-vault.mjs health
```

---

## 🔄 GitOps — Fluxo de Trabalho

### Por Fase (MCP Taskmaster)
```
1. Criar fase    → .agent/phases/PH-XX-NOME/
2. Branch        → git checkout -b feature/PH-XX-NOME
3. Commits       → feat(PH-XX): Task X.Y completed
4. Merge         → git checkout main && git merge feature/PH-XX
5. Tag           → git tag -a "v2026.MM.DD-PH-XX" -m "Phase completed"
6. Push          → git push origin main --tags
```

### CI/CD com GitHub Actions
```yaml
# .github/workflows/ci-smoke.yml
name: "Antigravity CI"
on: [push]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: node tools/smoke-core.mjs
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
```

### Regras de Ouro
- Nunca commitar `.env`
- Sempre rodar scan antes do push: `bash tools/secret-scanner.sh`
- Tags datadas: `vYYYY.MM.DD-PH-XX`

---

_Operações Antigravity v1.0_
