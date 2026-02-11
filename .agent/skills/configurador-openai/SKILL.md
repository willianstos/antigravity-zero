---
name: configurador-openai
description: Guia definitivo e imbatível para configurar modelos OpenAI no OpenClaw v2026.
---

# 🦞 Skill: Configurador OpenAI (The Sovereign Path)

Esta skill documenta o método "Zero Erro" para integrar modelos OpenAI (GPT-4o, GPT-4o-mini, o1) no ecossistema **OpenClaw/OpenCode**.

## 🛡️ Os Três Pilares da Configuração

Para que o Jarvis nunca mais perca a conexão, a configuração deve existir em harmonia nestes três locais:

### 1. O Cofre de Ambiente (`.env`)
O `.env` é onde a chave física reside. Ele deve estar protegido e formatado corretamente.

**Local:** `/home/zappro/antigravity-zero/.env`
**Formato:**
```bash
OPENAI_API_KEY="sk-proj-XXXXX..."
```
**Comando de Segurança:**
`sudo chattr +i .env` (Torna o arquivo imutável após a edição).

---

### 2. O Manifesto do Sistema (`openclaw.json`)
Aqui definimos o **Perfil de Autenticação** e o **Modelo Primário**. Não coloque a chave de API aqui diretamente para evitar erros de validação do `doctor`.

**Local:** `~/.openclaw/openclaw.json`
**Snippet Crítico:**
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai/gpt-4o-mini"
      }
    }
  },
  "auth": {
    "profiles": {
      "openai:default": {
        "provider": "openai",
        "mode": "api_key"
      }
    }
  }
}
```

---

### 3. A Memória do Agente (`auth-profiles.json`)
Este é o "cérebro" interno do agente. É aqui que o OpenClaw busca a credencial ativa durante a execução.

**Local:** `~/.openclaw/agents/main/agent/auth-profiles.json`
**Estrutura Vital:**
```json
{
  "version": 1,
  "profiles": {
    "openai:default": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-proj-XXXXX..."
    }
  },
  "lastGood": {
    "openai": "openai:default"
  }
}
```

---

## 🛠️ Checklist de Ativação (Modo Troubleshooting)

Se o Jarvis reclamar de credenciais, siga esta sequência exata:

1.  **Limpeza de Processos:**
    `sudo fuser -k 18789/tcp`
2.  **Validação de Configuração:**
    `openclaw doctor --fix`
3.  **Reinicialização do Gateway:**
    `sudo systemctl restart openclaw.service`
4.  **Teste de Conectividade:**
    `openclaw message send --channel telegram --target <seu_id> --message "Jarvis Online"`

## ⚠️ Armadilhas Comuns (Anti-Ghosting)
- **Model IDs:** Sempre use o prefixo do provedor (ex: `openai/gpt-4o`). Sem o prefixo, o sistema não sabe qual plugin chamar.
- **Unrecognized Key:** Se o `openclaw.json` der erro de "Unrecognized key", remova o campo `key` ou `apiKey` do JSON e garanta que ele esteja no `auth-profiles.json` ou no `.env`.
- **EADDRINUSE:** O erro de porta ocupada indica que um processo antigo não morreu. O `fuser -k` é obrigatório antes de qualquer restart.

---
*Documentação gerada em 11/02/2026 para o Mestre William. Soberania total no H2.*
