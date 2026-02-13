// full-auto
# PRD: Sovereign Visual Cortex (PH-19) 👁️🤖⚡

## 🎯 Objetivo
Transformar o Qwen2-7B-Omni no Córtex Visual do Cluster H2, permitindo navegação LAM (Large Action Model) guiada por visão real em vez de apenas código. Eliminar o modo "headless" para garantir total visibilidade operacional.

## 🏗️ Arquitetura Técnica
- **Model Server**: vLLM rodando Qwen2-7B-Omni no Nó H2 (RTX 3060).
- **Vision Feed**: Script `bin/vision-feed.mjs` capturando tela em loop (1fps) e enviando para o vLLM.
- **Visual Grounding**: Integração com `browse-use` para cliques baseados em coordenadas visuais (YOLO/Omni approach).
- **Terminal Monitor**: OCR/Omni detection de erros no terminal Xubuntu.

## 🤖 Roles & Skills
- **The Visionary**: Qwen2-7B-Omni (Visual Cortex).
- **The Operator**: `navegador-automatizado` + `browse-use`.
- **The Pilot**: Jarvis Sovereign Orchestrator (v9.0).

## 📝 Lista de Tarefas (Fase 019)
- [ ] Configurar vLLM p/ Qwen2-7B-Omni no H2 [ ]
- [ ] Implementar `bin/vision-feed.mjs` (Screenshot Loop) [/]
- [ ] Desenvolver `bin/vision-guided-lam.mjs` (Navegação Visual) [ ]
- [ ] Integrar Terminal Vision Guard (Auto-Correction Visual) [ ]
- [ ] Executar Missão de Extração HVAC Daikin (Visual Mode) [ ]

---
*Assinado: Jarvis Sovereign Orchestrator - 12/02/2026*
