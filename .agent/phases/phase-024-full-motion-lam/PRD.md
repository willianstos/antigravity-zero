# PRD: FULL-MOTION LAM IGNITE (Phase 24) 🚀🦅🔥

**Objetivo**: Executar a ignição total do OpenClaw em modo "Large Action Model" (LAM) soberano. Quebrar a inércia e provar controle físico do hardware H2.

## 🧱 Arquitetura de Execução
- **Hardware**: Nó H2 (Xubuntu / NVIDIA RTX 3060).
- **Agente**: OpenClaw (Jarvis v12.0).
- **Interface**: MCP Taskmaster (Full-Auto).

## 🛠️ Roles & Skills
- **@administrador-do-sistema**: Controle de hardware (`nvidia-smi`).
- **@navegador-automatizado**: Controle de browser (`browse-use`).
- **@open-code-controller**: Engenharia de software (`opencode`).

## //FULL-AUTO TASKS
[ ] **Task 24.1: Hardware Proof (GPU)**
    - Executar `nvidia-smi` e validar output da RTX 3060.
    - Reportar VRAM e Driver Version.

[ ] **Task 24.2: Visual Proof (Browser LAM)**
    - Lançar Chrome/Chromium via Playwright/Puppeteer (Headless: False).
    - Navegar para `https://www.daikin.com` ou `https://www.hitachi.com`.
    - Mover mouse (simulado) e clicar em link técnico "Products" ou similar.
    - Capturar Screenshot do sucesso.

[ ] **Task 24.3: Engineering Proof (Open Code)**
    - Abrir terminal lateral (simulado).
    - Executar `ls -la .agent/phases/phase-023-sovereign-orchestrator-v10/PRD.md`.
    - Validar leitura do sistema de arquivos.

## 📊 Critérios de Aceite (Done Definition)
1. Output do `nvidia-smi` visível no log.
2. Screenshot `daikin_lam_proof.png` na pasta artifacts.
3. Log do `ls` comprovando acesso ao arquivo legado.

---
*Jarvis v12.0 - Ignition Protocol*
