---
description: Trocar API key do OpenRouter no OpenClaw (via CLI ou dashboard) e restaurar.
---

# Workflow: Trocar API Key do OpenRouter

// turbo-all

## Quando usar
- Rate limit no modelo free
- API key comprometida/vazada
- Trocar para modelo pago

---

## Opção 1: Via Antigravity (CLI — 1 comando)

### 1. Desbloquear .env
```bash
sudo chattr -i /home/zappro/antigravity-zero/.env
```

### 2. Trocar a key
```bash
# Substitui a key antiga pela nova
sed -i "s|OPENROUTER_API_KEY=.*|OPENROUTER_API_KEY=\"SUA_NOVA_KEY_AQUI\"|" /home/zappro/antigravity-zero/.env
```

### 3. (Opcional) Trocar o modelo
```bash
# Modelos recomendados:
# Free:     openrouter/pony-alpha
# Pago:     anthropic/claude-sonnet-4, google/gemini-2.5-pro
sed -i "s|OPENROUTER_MODEL=.*|OPENROUTER_MODEL=\"anthropic/claude-sonnet-4\"|" /home/zappro/antigravity-zero/.env
```

### 4. Rebloquear .env
```bash
sudo chattr +i /home/zappro/antigravity-zero/.env
```

### 5. Recarregar Redis Vault
```bash
sudo chattr -i /home/zappro/antigravity-zero/.env
cd /home/zappro/antigravity-zero && node tools/redis-vault.mjs load
sudo chattr +i /home/zappro/antigravity-zero/.env
```

### 6. Reiniciar OpenClaw
```bash
sudo systemctl restart openclaw.service
```

### 7. Verificar
```bash
sudo systemctl status openclaw.service --no-pager | head -5
```

---

## Opção 2: Via Dashboard OpenClaw

### 1. Abrir dashboard
```bash
openclaw configure
```

### 2. Navegar até API Keys
- Selecionar `Agents > Defaults > Model`
- Ou: `Auth > Profiles > openrouter:default`

### 3. Colar a nova key quando solicitado

### 4. Salvar e reiniciar
```bash
sudo systemctl restart openclaw.service
```

---

## Opção 3: Via openclaw.json (direto)

### 1. Editar config
```bash
nano ~/.openclaw/openclaw.json
```

### 2. Trocar o modelo (linha ~18)
```json
"primary": "anthropic/claude-sonnet-4"
```

### 3. Trocar a key via auth CLI
```bash
openclaw auth login openrouter
# Cole a nova key quando pedir
```

### 4. Reiniciar
```bash
sudo systemctl restart openclaw.service
```

---

## Como Voltar ao Modelo Free

```bash
# 1. Volta pro modelo free
sudo chattr -i /home/zappro/antigravity-zero/.env
sed -i "s|OPENROUTER_MODEL=.*|OPENROUTER_MODEL=\"openrouter/pony-alpha\"|" /home/zappro/antigravity-zero/.env
sudo chattr +i /home/zappro/antigravity-zero/.env

# 2. Reiniciar
sudo systemctl restart openclaw.service
```

---

## Modelos Disponíveis no OpenRouter

| Modelo | Preço | Qualidade | Use quando |
|---|---|---|---|
| `openrouter/pony-alpha` | Free | Boa | Budget zero, aceita rate limit |
| `openrouter/auto` | Variável | Auto-select | Deixar OpenRouter escolher |
| `google/gemini-2.5-flash` | Barato | Muito boa | Custo-benefício |
| `google/gemini-2.5-pro` | Médio | Excelente | Tarefas complexas |
| `anthropic/claude-sonnet-4` | Médio | Excelente | Código + raciocínio |
| `anthropic/claude-3.5-sonnet` | Médio | Muito boa | Alternativa |

---

*Workflow criado em 11/02/2026 — DevOps 4.6 Supremo 🚀*
