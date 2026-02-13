# 🛠️ Guia de Configuração: Open Code API (v12.0)

Este guia detalha como configurar e autenticar a API do **Open Code (opencode-ai)** para uso soberano no cluster H1/H2.

## 1. Autenticação (Login)

O Open Code utiliza um sistema de autenticação via web para liberar o acesso aos modelos hospedados (como `gpt-5-nano`, `big-pickle`).

**Comando:**
```bash
opencode auth login
```
*Isso abrirá o navegador para autenticação via GitHub ou Email.*

**Verificar Status:**
```bash
opencode auth list
```
*(Deve mostrar suas credenciais ativas em `~/.local/share/opencode/auth.json`)*

## 2. Seleção de Modelos (Models)

O Open Code suporta diversos modelos. Para listar os disponíveis e seus custos (tokens):

**Listar Modelos:**
```bash
opencode models --refresh --verbose
```

**Exemplo de Saída:**
- `opencode/gpt-5-nano` (Rapidíssimo, ideal para scripts simples)
- `opencode/big-pickle` (Default, Balanced)
- `openai/gpt-5.2-codex` (Sovereign Choice: Melhor custo-benefício para código complexo)
- `openai/gpt-5-nano` (Ultra-Low Cost: Para tarefas triviais)

**Selecionar Modelo Específico:**
Use a flag `-m` ou `--model` ao rodar comandos:

**Para Código Complexo (Recomendado):**
```bash
opencode run -m openai/gpt-5.2-codex "Crie uma API REST em Node.js com Swagger"
```

**Para Scripts Simples (Economia):**
```bash
opencode run -m openai/gpt-5-nano "Escreva um Hello World em Python"
```

## 3. Provedores Externos (BYOK)

Para usar suas próprias chaves de API (OpenAI, Anthropic) diretamente no Open Code, configure as variáveis de ambiente no arquivo `.env` do projeto ou exporte na sessão.

**OpenAI:**
```bash
export OPENAI_API_KEY="sk-..."
opencode run -m openai/gpt-4o "Analise este arquivo"
```

**Anthropic:**
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
opencode run -m anthropic/claude-3-5-sonnet "Refatore este código"
```

## 4. Integração com OpenClaw (Sovereign Rules)

O OpenClaw Bot foi configurado para usar o Open Code como seu **Engenheiro de Campo** (Skill `@open-code-controller`).

- **Comando Master:** `opencode run "..."`
- **Auditoria:** Todo código gerado passa pelo `@protocolo-de-seguranca` antes do deploy.

## 5. Automação Soberana (v12.0)

Para evitar configurar chaves manualmente a cada sessão, utilize o wrapper soberano:

**Comando:**
```bash
bash bin/opencode-sov run "..."
```
*Este script carrega automaticamente o `.env`, configura o Git e executa o Open Code com identidade verificada.*

**Alias Recomendado:**
```bash
alias opencode="bash bin/opencode-sov"
```

---
*Jarvis v12.0 - Engineering Enclave*
