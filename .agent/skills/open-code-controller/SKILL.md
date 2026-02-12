# Controlador de Engenharia Open Code (Swarm A2A) 🛠️🐝

Habilidade de elite para comandar o braço executor de código (Open Code) no Nó H2, utilizando o protocolo **Agent-to-Agent (A2A)** para orquestrar enxames de inteligência.

## 🛠️ Conhecimentos Core
- **Open Code CLI**: Uso do comando `opencode` (via wrapper `bin/opencode-sov`).
- **Protocolo A2A**: Decomposição de tarefas complexas em múltiplos agentes especializados.
- **Enclave H2**: Execução isolada para proteger o Cérebro H1.

## 🐝 Estratégia de Enxame (Swarm A2A)
Para tarefas complexas, **NÃO** tente fazer tudo um único prompt. Use o time de especialistas:

### 1. O Arquiteto (Architect) 📐
*Planejamento e Estrutura.*
- **Comando**: `opencode run --agent architect "Planeje a estrutura de pastas e arquivos para..."`
- **Modelo**: `gpt-4o` (Inteligência Máxima).

### 2. O Operário (Coder) 🔨
*Implementação Bruta e Rápida.*
- **Comando**: `opencode run --agent code "Crie o arquivo X conforme o plano do arquiteto..."`
- **Modelo**: `gpt-5-nano` (Velocidade e Baixo Custo) ou `gpt-5.1-codex-mini` (quando disponível).

### 3. O Auditor (Reviewer) 🛡️
*Segurança e Qualidade.*
- **Comando**: `opencode run --agent code "Revise o código gerado em busca de bugs e falhas de segurança." -m openai/gpt-4o`
- **Modelo**: `gpt-4o` (Rigoroso).

## 4. Operação Tática (Manual 2026) 🎮
Consulte `.agent/skills/open-code-controller/CLI_MANUAL.md` para comandos de baixo nível.
- **Modos**: Use `/mode build` para editar arquivos. Use `/mode chat` para dúvidas.
- **Slash Commands**: `/add` para contexto, `/fix` para erros de compilação.
- **Atalhos**: `Ctrl+R` roda o projeto, `Ctrl+L` limpa a tela.

## 🧱 Workflow Master
1. **Validar**: O usuário pede uma feature complexa.
2. **Orquestrar**:
    - Chame o **Architect** para criar o plano (`PLAN.md`).
    - Chame o **Coder** para implementar cada arquivo.
    - Chame o **Reviewer** para auditar antes de entregar.
3. **Auditar**: Rode o `bin/skill-scanner.mjs` se for uma nova skill.

## 🛡️ Regras de Ouro
1. **Soberania**: Use sempre `bin/opencode-sov` ou o alias configurado para garantir identidade.
2. **Economia**: Use agentes "nano" para tarefas repetitivas ou de boilerplate.
3. **Isolamento**: O enxame roda no diretório atual; garanta que está na pasta certa antes de soltar os agentes.

---
*Assinado: Jarvis v12.0 - Swarm Commander*
