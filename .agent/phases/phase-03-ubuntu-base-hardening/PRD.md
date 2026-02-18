# PRD: Phase 03 - Ubuntu Base Hardening (Open Claw Foundation) 🔧

//full-auto

---

## 1. Diagnóstico Brutal (Auditoria do Sistema)

### 🔴 Problemas Críticos Identificados

**BOOT / GRUB:**
- Sistema está em **BIOS/MBR** (não UEFI). `/sys/firmware/efi` não existe.
- `GRUB_TIMEOUT=0` + `GRUB_TIMEOUT_STYLE=hidden` → **menu de boot invisível**. Você não consegue escolher Windows no boot.
- `GRUB_DISABLE_OS_PROBER` está **comentado** → os-prober pode estar desabilitado por padrão no Ubuntu 22+.
- Windows 11 está em `/dev/sda` (HDD, 111.8G, NTFS). Xubuntu está em `/dev/nvme0n1` (SSD NVMe, 465.8G).
- **Conclusão**: O GRUB está no NVMe (Xubuntu), mas não detecta o Windows no SDA porque o os-prober está desabilitado.

**TERMINAL BLOQUEADO:**
- O terminal travou porque `node src/backend/src/redis-vault.mjs load` tentou conectar ao Redis com senha mas a URL estava errada. O `redis-cli ping` retorna `NOAUTH` = Redis tem senha mas o vault não sabe qual é.

**AVISOS CHATOS (quiet splash):**
- `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"` já está configurado, mas pode haver mensagens de systemd.

---

## 2. Arquitetura da Solução

```
[NVMe - Xubuntu]          [SDA - Windows 11]
  GRUB (bootloader)  →→→   detecta via os-prober
       ↓
  Menu de Boot (5s timeout)
  [1] Xubuntu (padrão)
  [2] Windows 11
```

**Para o Open Claw Bot (Base Sólida):**
```
Ubuntu Desktop (Xubuntu)
  ├── Redis (autenticado, sempre ativo)
  ├── Qdrant (sempre ativo)
  ├── Jarvis Swarm Server (systemd service)
  └── OpenClaw Telegram Bot (systemd service)
```

---

## 3. Roles & Skills
- `administrador-do-sistema`: Hardening GRUB, systemd, Redis.
- `zelador-do-codigo`: Limpeza de avisos e warnings no código.

---

## 4. Fila de Tasks

### 🔴 CRÍTICO — GRUB (Dual Boot)
- [ ] **T01**: Habilitar `os-prober` no `/etc/default/grub`.
- [ ] **T02**: Configurar `GRUB_TIMEOUT=5` e `GRUB_TIMEOUT_STYLE=menu`.
- [ ] **T03**: Remover `quiet splash` e adicionar `loglevel=3` (sem avisos de boot).
- [ ] **T04**: Executar `sudo update-grub` para detectar Windows 11.

### 🟡 ALTO — Redis Vault Fix
- [ ] **T05**: Corrigir `REDIS_URL` no `.env` com a senha correta do Redis.
- [ ] **T06**: Carregar secrets no vault: `node src/backend/src/redis-vault.mjs load`.

### 🟢 MÉDIO — Open Claw Base Sólida
- [ ] **T07**: Criar `infra/systemd/jarvis-swarm.service` (auto-start no boot).
- [ ] **T08**: Criar `infra/systemd/openclaw-bot.service` (auto-start no boot).
- [ ] **T09**: Remover warnings do código (PERSONA.md, logs excessivos).

---

## ⚠️ ATENÇÃO — Sobre "Remover Guardrails"

**Verdade técnica**: Os guardrails do OpenAI/Gemini são do lado do servidor deles. Você não pode removê-los via código local. O que você PODE fazer:
1. Usar **OpenRouter com modelo Dolphin/Uncensored** (já implementado na Phase 01).
2. Instalar **Ollama local** com modelo sem filtros (ex: `dolphin-llama3`).
3. O `input-sanitizer.mjs` que reescrevemos protege o SEU sistema, não bloqueia o LLM.

---

## 5. Comandos de Execução (Referência Rápida)

```bash
# GRUB Fix (Dual Boot Windows 11)
sudo sed -i 's/GRUB_TIMEOUT=0/GRUB_TIMEOUT=5/' /etc/default/grub
sudo sed -i 's/GRUB_TIMEOUT_STYLE=hidden/GRUB_TIMEOUT_STYLE=menu/' /etc/default/grub
sudo sed -i 's/#GRUB_DISABLE_OS_PROBER=false/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub
sudo sed -i 's/quiet splash/loglevel=3 nowatchdog/' /etc/default/grub
sudo update-grub

# Redis Vault
node src/backend/src/redis-vault.mjs load

# Instalar serviços systemd
sudo cp infra/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable jarvis-swarm openclaw-bot
```
