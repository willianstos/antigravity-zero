# 🤖 Frota de Agentes (Agents)

## Núcleo do Jarvis (Core)
O sistema é composto por agentes especializados que se comunicam via Jarvis Orchestrator.

### 1. Terminal (Aider/Shell)
- **Função**: Executar comandos, editar código, gerenciar Git.
- **Ferramenta**: Aider (IA para código) + Bash.
- **Uso**: `/roda uptime`, `/edita server.js`.

### 2. Visão (Vision)
- **Função**: Ver o que o usuário vê.
- **Ferramenta**: FFmpeg/X11Grab + GPT-4o-V/Gemini.
- **Uso**: `screenshot`, `ler tela`.

### 3. Mouse & Teclado
- **Função**: Interação física com o Desktop.
- **Ferramenta**: xdotool.
- **Uso**: `clica em 500,500`, `tecla enter`.

### 4. Navegador (Browser)
- **Função**: Automação web e pesquisa.
- **Ferramenta**: Playwright.
- **Uso**: `abre google.com`, `extrai dados`.

## Agentes de Estado (Stateful)

### 5. Gemini Web
- **Função**: Raciocínio de long-context com Custo Zero.
- **Sessão**: Usa perfis persistentes do Chrome (Willian vs Alien).

### 6. Perplexity Search
- **Função**: Busca de informações em tempo real com fontes.

### 7. Mission Control
- **Função**: Orquestração autônoma de missões complexas em segundo plano.

### 8. Autonomous Scheduler (Vigilante)
- **Função**: Agendador de tarefas recorrentes e monitoramento de saúde.
