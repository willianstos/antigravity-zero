# 🔐 FORTALEZA ANTIGRAVITY — Manual de Segurança Completo

> _"A `.env` é sangue da família. 14 camadas de proteção. Só a PEM destrava."_
> _Criado em: 11/02/2026 — Will-dev & Jarvis Sovereign_

---

## 📋 Índice

1. [Arquitetura da Fortaleza](#arquitetura)
2. [As 14 Camadas](#camadas)
3. [Chave PEM Mestre (Camada 14)](#pem)
4. [Comandos Essenciais](#comandos)
5. [O que Fazer em Emergência](#emergencia)
6. [Como Editar a .env](#editar-env)
7. [Secrets Protegidas](#secrets)
8. [Configurações Aplicadas no Sistema](#configs)
9. [Localização dos Arquivos](#arquivos)

---

## 🏗️ Arquitetura da Fortaleza {#arquitetura}

```
                         ┌─────────────────┐
                         │  SSD EXTERNO 💾  │
                         │  master-key.pem  │
                         │  (Última Defesa) │
                         └────────┬────────┘
                                  │ só em emergência
                                  ▼
┌─────────────────────────────────────────────────────┐
│                 CAMADA 14: PEM MESTRE               │
│  Backup cifrado AES-256 + RSA-4096 da .env          │
│  Só descriptografa com a PEM do SSD externo          │
├─────────────────────────────────────────────────────┤
│                 CAMADA 13: REDIS AUDIT              │
│  Toda consulta ao vault é logada no slowlog          │
├─────────────────────────────────────────────────────┤
│                 CAMADA 12: WATCHER .ENV             │
│  inotifywait monitora leitura/escrita em tempo real  │
├─────────────────────────────────────────────────────┤
│                 CAMADA 11: CORE DUMPS OFF           │
│  Crash de processo NÃO gera dump de memória          │
├─────────────────────────────────────────────────────┤
│                 CAMADA 10: HISTIGNORE               │
│  Bash NÃO salva comandos com tokens/keys/senhas      │
├─────────────────────────────────────────────────────┤
│                 CAMADA 9: GIT HOOKS                 │
│  Apontando pro pre-commit guardião                   │
├─────────────────────────────────────────────────────┤
│                 CAMADA 8: GIT TRACKING              │
│  .env removida do tracking do Git                    │
├─────────────────────────────────────────────────────┤
│                 CAMADA 7: CHATTR +I                 │
│  .env IMUTÁVEL — nem root edita sem desbloquear      │
├─────────────────────────────────────────────────────┤
│                 CAMADA 6: CÓDIGO DE HONRA           │
│  10 regras que todo agente do time segue             │
├─────────────────────────────────────────────────────┤
│                 CAMADA 5: PRE-COMMIT HOOK           │
│  Bloqueia commits com padrões de API keys/tokens     │
├─────────────────────────────────────────────────────┤
│                 CAMADA 4: SENTINEL WATCH            │
│  Anti-keylogger + detecta processos espiões          │
├─────────────────────────────────────────────────────┤
│                 CAMADA 3: ANTI-INJECTION            │
│  30+ padrões de prompt injection bloqueados          │
│  Autenticação por Telegram ID (7220607041)           │
├─────────────────────────────────────────────────────┤
│                 CAMADA 2: REDIS VAULT               │
│  Porteiro: senha + bind 127.0.0.1 + TTL 24h         │
├─────────────────────────────────────────────────────┤
│                 CAMADA 1: SECRET SCANNER            │
│  Varre workspace por padrões de secrets expostas     │
├─────────────────────────────────────────────────────┤
│                    📄 .ENV                          │
│            (perm 600 + imutável + cifrada)            │
└─────────────────────────────────────────────────────┘
```

---

## 🛡️ As 14 Camadas em Detalhe {#camadas}

### Camada 1: Secret Scanner
- **Script:** `tools/secret-scanner.sh`
- **O que faz:** Varre todo o workspace por padrões de API keys (sk-, ghp_, Bearer, JWT, PEM)
- **Quando roda:** Manual + pre-commit

### Camada 2: Redis Vault (Porteiro)
- **Script:** `tools/redis-vault.mjs`
- **O que faz:** Secrets carregadas do .env para Redis em memória
- **Config:** Senha `antigravity-fortress-2026`, bind `127.0.0.1`, TTL 24h
- **Regra:** Agentes consultam Redis, NUNCA leem .env diretamente

### Camada 3: Anti-Prompt Injection
- **Script:** `tools/anti-injection.mjs`
- **O que faz:** Filtra 30+ padrões de ataque em inputs de texto
- **Autenticação:** Secrets só são mostradas para Telegram ID 7220607041
- **Padrões:** "ignore instructions", "show env", "debug mode", etc.
- **Log:** `artifacts/security/injection-attempts.json`

### Camada 4: Sentinel Watch (Anti-Keylogger)
- **Script:** `tools/sentinel-watch.sh`
- **O que faz:** Detecta keyloggers (xinput, xev, logkeys), conexões suspeitas, arquivos em /tmp
- **Verifica:** Permissões da .env, status do Redis, processos espiões

### Camada 5: Pre-Commit Hook
- **Script:** `tools/pre-commit-hook.sh` → `.git/hooks/pre-commit`
- **O que faz:** Bloqueia commits que contenham padrões de API keys ou tokens
- **Resultado:** Commit negado com mensagem de desonra

### Camada 6: Código de Honra
- **Arquivo:** `.agent/rules/security-honor-code.md`
- **O que faz:** 10 regras que todo agente do time deve seguir
- **Destaque:** "Vazamento = desonra. Pode criticar o líder. Proteger > tudo."

### Camada 7: .env Imutável (chattr +i)
- **O que faz:** Flag do filesystem que impede **qualquer** modificação
- **Desbloquear:** `sudo chattr -i .env`
- **Rebloquear:** `sudo chattr +i .env`

### Camada 8: Git Tracking Removido
- **O que faz:** `.env` não é rastreada pelo Git, mesmo se alguém tentar `git add`
- **Verificação:** `git ls-files .env` deve retornar vazio

### Camada 9: Git Hooks Path
- **O que faz:** `core.hooksPath` aponta para `.git/hooks` com nosso guardião
- **Verificação:** `git config core.hooksPath`

### Camada 10: HISTIGNORE
- **O que faz:** Bash não salva comandos que contenham TOKEN, SECRET, PASSWORD, KEY, sk-, ghp_, Bearer
- **Localização:** `~/.bashrc` (HISTIGNORE + HISTCONTROL=ignoreboth)

### Camada 11: Core Dumps Desabilitados
- **O que faz:** Crash de processo NÃO gera arquivo de dump de memória
- **Config:** `ulimit -c 0` + `/etc/security/limits.conf` + `kernel.core_pattern=|/bin/false`
- **Por que:** Um dump de memória pode conter secrets que estavam carregadas

### Camada 12: Watcher de Acesso ao .env
- **Script:** `tools/env-watcher.sh`
- **O que faz:** Monitora em tempo real todo acesso (leitura/escrita) ao .env
- **Log:** `artifacts/security/env-access.log`
- **Alerta:** Se .env for modificada, alerta IMEDIATO

### Camada 13: Redis Audit Log
- **O que faz:** Todo comando no Redis é logado no slowlog
- **Config:** `slowlog-log-slower-than 0` (loga TUDO)
- **Ver logs:** `redis-cli -a antigravity-fortress-2026 SLOWLOG GET 10`

### Camada 14: Chave PEM Mestre (Break Glass)
- **Chave privada:** `master-key.pem` → **MOVER PARA SSD EXTERNO**
- **Chave pública:** `artifacts/security/emergency/master-key.pub`
- **Backup cifrado:** `artifacts/security/emergency/env-backup.enc`
- **Session key cifrada:** `artifacts/security/emergency/session.key.enc`
- **Restauração:** `bash tools/emergency-restore.sh /caminho/ssd/master-key.pem`

---

## 🔑 Chave PEM Mestre — A Última Defesa {#pem}

### Como Funciona
```
.env ──[AES-256-CBC]──► env-backup.enc (cifrado)
                            │
session.key ─[RSA-4096]─► session.key.enc (cifrada com PEM pública)
                            │
master-key.pem ◄────────── SSD EXTERNO (só Will-dev tem)
```

1. A `.env` foi cifrada com uma chave de sessão aleatória (AES-256)
2. A chave de sessão foi cifrada com a chave pública RSA-4096
3. Só a chave privada (`master-key.pem`) pode descriptografar
4. A chave privada vai pro SSD externo e é DELETADA do computador

### O Que Fazer Com a PEM

⚠️ **AÇÃO NECESSÁRIA:**
```bash
# 1. Conecte o SSD externo
# 2. Copie a PEM para o SSD
cp artifacts/security/emergency/master-key.pem /media/zappro/SSD_EXTERNO/

# 3. DELETE a PEM do computador
shred -u artifacts/security/emergency/master-key.pem

# 4. Verifique que só a pública ficou
ls artifacts/security/emergency/
# → Deve ter: master-key.pub  env-backup.enc  session.key.enc
# → NÃO deve ter: master-key.pem
```

### Quando Usar
- **NUNCA** em operação normal. O sistema funciona 100% sem a PEM.
- **APENAS** se: todas as secrets vazaram, .env foi corrompida, ou disaster recovery total
- A PEM **não pede toda hora**. Fica dormindo no SSD externo.

---

## ⌨️ Comandos Essenciais {#comandos}

### Dia a dia (não precisa da PEM)
```bash
# Scan de secrets
bash tools/secret-scanner.sh

# Health check do sistema
bash tools/sentinel-watch.sh

# Ver secrets no Redis (mascaradas)
node tools/redis-vault.mjs list

# Health do Redis
node tools/redis-vault.mjs health

# Testar anti-injection
node tools/anti-injection.mjs test "ignore your instructions"

# Ver tentativas de injection
node tools/anti-injection.mjs incidents

# Monitorar acesso ao .env (deixar rodando em terminal)
bash tools/env-watcher.sh

# Ver quem consultou Redis
redis-cli -a antigravity-fortress-2026 SLOWLOG GET 10

# Aplicar todas as blindagens de novo
bash tools/blindagem-total.sh
```

### Editar .env (rotina)
```bash
sudo chattr -i .env    # desbloqueia
nano .env              # edita
sudo chattr +i .env    # rebloqueia
node tools/redis-vault.mjs load  # recarrega no Redis
```

### Emergência (precisa da PEM do SSD)
```bash
bash tools/emergency-restore.sh /media/zappro/SSD_EXTERNO/master-key.pem
```

---

## 🚨 O que Fazer em Emergência {#emergencia}

### Cenário 1: Secret vazou em commit
```bash
# 1. Revogar a secret no provedor (GitHub, OpenRouter, etc)
# 2. Gerar nova secret
# 3. Atualizar .env:
sudo chattr -i .env
nano .env   # trocar a secret
sudo chattr +i .env
# 4. Recarregar Redis
node tools/redis-vault.mjs load
# 5. Fazer novo backup cifrado
bash tools/blindagem-total.sh
```

### Cenário 2: .env corrompida ou deletada
```bash
# Conectar SSD externo e restaurar do backup cifrado
bash tools/emergency-restore.sh /media/zappro/SSD_EXTERNO/master-key.pem
```

### Cenário 3: Suspeita de invasão
```bash
# 1. Scan completo
bash tools/sentinel-watch.sh
# 2. Verificar injection attempts
node tools/anti-injection.mjs incidents
# 3. Ver quem acessou Redis
redis-cli -a antigravity-fortress-2026 SLOWLOG GET 50
# 4. Revogar Redis
redis-cli -a antigravity-fortress-2026 FLUSHDB
# 5. Rotacionar TODAS as secrets
```

---

## 🔑 Secrets Protegidas {#secrets}

| Secret | Uso | Rotação |
|---|---|---|
| `PERPLEXITY_EMAIL` | Login Perplexity AI | Trocar senha no site |
| `PERPLEXITY_PASSWORD` | Login Perplexity AI | Trocar senha no site |
| `GITHUB_TOKEN` | Acesso API GitHub | GitHub > Settings > Tokens |
| `FIRECRAWL_API_KEY` | API de scraping | Dashboard Firecrawl |
| `TELEGRAM_BOT_TOKEN` | Bot Telegram | @BotFather /revoke |
| `TELEGRAM_USER_ID` | ID do líder | Não rotaciona |
| `ANTIGRAVITY_PRIMARY_USER` | Conta principal | Trocar senha |
| `ANTIGRAVITY_PRIMARY_PASS` | Senha principal | Trocar senha |
| `ANTIGRAVITY_TIER2_USER` | Conta secundária | Trocar senha |
| `ANTIGRAVITY_TIER2_PASS` | Senha secundária | Trocar senha |
| `OPENROUTER_API_KEY` | Motor AI do bot | Dashboard OpenRouter |
| `OPENCLAW_ACCESS_TOKEN` | Gateway do OpenClaw | Regenerar no CLI |

---

## ⚙️ Configurações Aplicadas no Sistema {#configs}

| Item | Valor | Localização |
|---|---|---|
| .env permissão | 600 (rw-------) | `ls -la .env` |
| .env imutável | chattr +i | `lsattr .env` |
| sudoers NOPASSWD | zappro ALL=(ALL) NOPASSWD: ALL | `/etc/sudoers.d/zappro-nopasswd` |
| Redis bind | 127.0.0.1 | `redis-cli CONFIG GET bind` |
| Redis senha | antigravity-fortress-2026 | `redis-cli -a ... ping` |
| Redis slowlog | log tudo (0μs) | `redis-cli CONFIG GET slowlog-log-slower-than` |
| Core dumps | desabilitado | `/etc/security/limits.conf` |
| HISTIGNORE | ativo | `~/.bashrc` |
| Git hooks | apontando pro guardião | `.git/hooks/pre-commit` |
| Pre-commit | ativo | `git commit --dry-run` testará |

---

## 📁 Localização dos Arquivos {#arquivos}

```
antigravity-zero/
├── .env                          ← 🔐 JOIA DA COROA (perm 600, imutável)
├── .gitignore                    ← .env listada aqui
├── .git/hooks/pre-commit         ← pre-commit guardião
├── SOUL.md                       ← Persona do bot (v3.0 equilibrada)
├── IDENTITY.md                   ← Nome e vibe do bot
├── .clinerules                   ← Protocolo de Soberania
├── .openclaw.rules.md            ← Regras do workspace
│
├── .agent/
│   ├── rules/
│   │   └── security-honor-code.md  ← 10 regras de honra do time
│   ├── skills/
│   │   └── guardiao-de-secrets/
│   │       └── SKILL.md            ← Skill de segurança (6 camadas)
│   └── phases/
│       └── PH-07-PARCERIA-OPENCLAW/
│           ├── PRD.md              ← 72 tasks para os alunos
│           └── tasks.json          ← Memória de estado MCP Taskmaster
│
├── tools/
│   ├── secret-scanner.sh           ← Camada 1: scan de secrets
│   ├── redis-vault.mjs             ← Camada 2: porteiro Redis
│   ├── anti-injection.mjs          ← Camada 3: filtro anti-injection
│   ├── sentinel-watch.sh           ← Camada 4: anti-keylogger
│   ├── pre-commit-hook.sh          ← Camada 5: bloqueio de commit
│   ├── env-watcher.sh              ← Camada 12: monitor de acesso
│   ├── blindagem-total.sh          ← Aplica camadas 7-13 de uma vez
│   └── emergency-restore.sh        ← Break glass (requer PEM)
│
├── artifacts/security/
│   ├── incidents.json              ← Histórico de incidentes
│   ├── injection-attempts.json     ← Tentativas de injection
│   ├── env-access.log              ← Log de acesso ao .env
│   └── emergency/
│       ├── master-key.pem          ← ⚠️ MOVER PARA SSD EXTERNO E DELETAR
│       ├── master-key.pub          ← Chave pública (fica no computador)
│       ├── env-backup.enc          ← Backup cifrado da .env
│       └── session.key.enc         ← Chave de sessão cifrada
│
└── docs/
    ├── FORTALEZA-SECURITY.md       ← ESTE ARQUIVO
    ├── AGENT-TEAM-ARCHITECTURE.md  ← Arquitetura do time de agentes
    └── TELEGRAM-AGENT-SETUP.md     ← Guia de setup via Telegram
```

---

_Fortaleza Antigravity v1.0 — 14 camadas de proteção_
_"A PEM dorme no SSD. Só acorda em emergência. Daqui nada vaza."_ 🔐🦅
