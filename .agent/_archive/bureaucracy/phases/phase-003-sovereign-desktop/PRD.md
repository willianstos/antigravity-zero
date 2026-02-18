// full-auto
# PRD: Sovereign Desktop & HVAC Intelligence (Fase 003) 🦅💎

## 🎯 Objetivo
Transformar o Nó H2 (RTX 3060) em um executor de tarefas de desktop ultra-eficiente e um ingestor de manuais HVAC de alta fidelidade, utilizando o Model Context Protocol (MCP) e modelos locais.

## 🏗️ Arquitetura Técnica
- **Hardware**: RTX 3060 (12GB) + Ryzen 5600X + 32GB RAM.
- **LLM Local**: Qwen2-7B-Omni (via vLLM/Llama.cpp) para extração de imagem-para-texto e geração de FAQ.
- **MCP Bridge**: Servidor `mcp-bridge.sh` ligando H1 (4090) ao H2 (3060) via stdio.
- **Automação Web**: Firecrawl API + Playwright CLI para navegar e baixar manuais da whitelist.
- **Vision Sentinel**: Gatilho automático de screenshots baseado em logs críticos do K3s.

## 🤖 Roles & Skills
- **Lead Architect**: Antigravity (Auditor & Orquestrador).
- **The Scout**: Navegação via Playwright + Firecrawl.
- **The Worker**: Processamento pesado via Docling + Qwen2 (GPU).
- **The Sentinel**: Monitoramento de logs (k3s-monitor).

## 📝 Lista de Tarefas (Fase 003)
- [ ] Implementar `mcp-bridge.sh` no Nó H2 [ ]
- [ ] Configurar Sentinela de Logs `k3s-monitor.sh` [ ]
- [ ] Criar Pipeline Ingestor HVAC v2: Ingestão -> Docling -> Qwen2 -> Super MD con FAQ [ ]
- [ ] Integrar novas regras "Antigravity Desktop 2026" na OpenClaw Constitution [ ]
- [ ] Teste de visão: `take_screenshot` automatizado por erro simulado [ ]
- [ ] Relatório final de performance GPU e eficiência do enxame [ ]

---
*Fase iniciada em 12/02/2026 - Master Protocol PH-10/11*
