# PRD: HVAC SKILL INTEGRATION & VALIDATION (Phase 26) 🦅❄️🛠️

**Objetivo**: Garantir que o Workflow de Ar-Condicionado (HVAC) definido em markdown seja reconhecido e executado pelo Bot Open Claw. Isso significa registrar a skill no "cérebro" (Skills Master) e validar o acesso aos recursos do Google Workspace via E2E Playwright.

## 🧱 Arquitetura de Execução
- **Agente**: OpenClaw (Engenheiro Soberano).
- **Skill**: `hvac-workflow` - Define checklist de instalação, manutenção e documentação.
- **Validação**: Teste E2E Soberano (`tests/e2e_hvac_workflow.js`).

## 🛠️ Roles & Skills
- **@open-code-controller**: Gerenciar e registrar a nova skill.
- **@navegador-automatizado**: Executar o teste E2E Playwright.

## //FULL-AUTO TASKS
[ ] **Task 26.1: Skill Registration**
    - Criar/Validar `.agent/skills/hvac-workflow/SKILL.md` com conteúdo completo.
    - Adicionar referência explícita em `.agent/skills/open-code-controller/SKILL.md` (Master Skill).
    - Adicionar referência em `.openclaw.rules.md` (Knowledge).

[ ] **Task 26.2: E2E Playwright Refactor**
    - Refatorar `tests/e2e_hvac_workflow.js` para ser resiliente a falhas de login (capturar tela e continuar).
    - Adicionar validação de acesso ao Google Calendar (simulado).

[ ] **Task 26.3: Skill Validation Run**
    - Executar `tests/e2e_hvac_workflow.js`.
    - Verificar evidências em `tests/e2e_evidence/`.

## 📊 Critérios de Aceite
1. Skill `hvac-workflow` listada em `SKILL.md`.
2. Teste E2E executa até o fim sem crash (mesmo com login required).
3. Evidências visuais de acesso ao Google Drive/Docs/Calendar.

---
*Jarvis v15.0 - HVAC Integration Protocol*
