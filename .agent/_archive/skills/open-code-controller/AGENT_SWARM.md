# Open Code Agent Swarm (A2A Protocol) 🐝💻

Estratégia avançada para orquestrar um time de agentes leves dentro do Open Code, utilizando o protocolo Agent-to-Agent (A2A).

## 1. Arquitetura do Enxame (Swarm)
O Open Code permite que múltiplos agentes especializados colaborem em uma única sessão.
- **Architect (Arquitetura):** Define a estrutura e padrões.
- **Coder (Desenvolvimento):** Escreve o código bruto.
- **Reviewer (QA):** Analisa bugs e segurança.

## 2. Como Invocar o Time (Comando A2A)
Para ativar o enxame, use a flag `--agent` e o nome do perfil do agente desejado.

```bash
# Passo 1: O Arquiteto desenha
opencode run --agent architect "Planeje uma API REST para gestão de frota"

# Passo 2: O Coder executa
opencode run --agent code "Implemente o plano acima usando Node.js e Express"

# Passo 3: O Reviewer valida
opencode run --agent code "Audite o código gerado em busca de falhas de segurança" -m openai/gpt-4o
```

## 3. Configuração de Agentes Leves
Crie perfis de agentes no seu `opencode.json` (quando suportado) ou via prompt de sistema para especializar modelos menores (`gpt-5-nano`) em tarefas específicas, economizando tokens.

**Exemplo de Prompt de Sistema para 'Coder':**
> "Você é um Coder Expert. Sua única função é escrever código limpo, sem explicações verbosas. Use typescript estrito."

## 4. Fluxo de Trabalho A2A Moderno
1. **Definição:** O Líder (Você) define o objetivo.
2. **Decomposição:** O agente `Planner` quebra em tarefas menores.
3. **Execução Paralela:** Agentes `Worker` (modelos nano) executam partes do código.
4. **Consolidação:** O agente `Merger` une tudo e roda os testes.

---
*Jarvis v12.0 - Open Code Swarm Commander*
