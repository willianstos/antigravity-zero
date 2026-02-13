# 🤖 Instruções do Sistema (System)

## Visão Geral
Antigravity-Zero é um cluster de agentes autônomos (Jarvis Swarm) que operam um Desktop Linux Xfce de forma soberana. O objetivo é a automação total de tarefas de DevOps, Engenharia e Pesquisa.

## Princípios de Design
1. **Modularidade**: Agentes independentes para Terminal, Visão, Navegador e Mouse.
2. **Consciência Semântica**: Memória de longo prazo via Qdrant.
3. **Custo Inteligente**: Priorizar Gemini Web (Gratuito/Browser) sobre chamadas de API pagas.

## Fluxo de Comando
- **Usuário** -> **Telegram (OpenClaw)** -> **Jarvis Orchestrator** -> **Agentes**.
- **Resultados** -> **Orchestrator** -> **Context Manager** -> **Telegram**.

---
*Este sistema é privado e de propriedade de William / Alien (2026).*
