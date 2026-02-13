# PRD: PRECISION NODE H2 IGNITION (Phase 25) 🦅🎯⚡

**Objetivo**: Executar a prova de conceito de "Full Motion LAM" usando a infraestrutura dimensionada (Ryzen 5600X | RTX 3060 12GB | 32GB RAM). Foco em agilidade e visão multimodal.

## 🧱 Arquitetura de Execução (Precision Setup)
- **Cérebro AI**: Qwen (Local, se disponível, ou fallback para GPT-4o via API por segurança).
- **Olhos (Vision)**: Playwright com Perfil Persistente (`~/.config/google-chrome`).
- **Mãos (Action)**: Simulação de mouse e teclado via Playwright.

## 🛠️ Roles & Skills
- **@administrador-do-sistema**: Gestão de hardware e logs de GPU.
- **@navegador-automatizado**: Navegação com contexto logado (Cookies).
- **@protocolo-de-seguranca**: Garantir que logins sensíveis não sejam expostos.

## //FULL-AUTO TASKS
[ ] **Task 25.1: VRAM Check**
    - Verificar estado atual da RTX 3060 com `nvidia-smi` para garantir que há espaço para inferência/render.

[ ] **Task 25.2: Agilidade Visual (Hitachi Manual)**
    - Lançar navegador persistente (Não-Headless).
    - Acessar Google ou Hitachi Global.
    - Buscar por "Hitachi Air Conditioning Error Codes".
    - Tentar entrar em um resultado técnico.
    - Capturar evidência (`hitachi_lam_proof.png`).

[ ] **Task 25.3: Audio Feedback (Simulado)**
    - Gerar um arquivo de texto com o "report de áudio" que o Jarvis falaria.
    - `audio_report.txt`: "Líder, encontrei a tabela de erros..."

## 📊 Critérios de Aceite
1. Navegador abriu visivelmente (se estiver no display :0).
2. Screenshot da busca/manual salvo.
3. Report de "áudio" gerado.

---
*Jarvis v15.0 - The Precision Node*
