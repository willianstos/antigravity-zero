// full-auto
# PRD: Ingestão e Inteligência de Manuais HVAC ❄️🤖

## 🎯 Objetivo
Automatizar a coleta (Playwright), o processamento (Docling), a tradução (GPU 3060) e a ingestão (Qdrant) de manuais técnicos de inversores HVAC das principais fabricantes (Daikin, Hitachi, LG, Mitsubishi).

## 🏗️ Arquitetura Técnica
- **Coleta**: Playwright (The Scout) varrendo URLs oficiais.
- **Processamento**: Docling + CUDA (GPU 3060) para extração de alta fidelidade em `/data/manuals/`.
- **Memória**: Qdrant (`open_claw_skills` / `hvac_knowledge`) via Librarian.
- **Auditoria**: Antigravity validando a integridade do JSON gerado.

## 🤖 Roles & Skills
- **Antigravity**: Lead Architect & Auditor (Iron Architect Protocol).
- **The Scout**: Navegação automatizada e descoberta de rotas.
- **The Worker**: Processamento pesado via Docling e GPU.
- **Librarian**: Indexação e curadoria semântica.

## Fase 2: Ingestão de Manuais HVAC ❄️🤖
- [x] Mapear URLs oficiais de suporte técnico (Daikin, LG, Hitachi, Mitsubishi, Fujitsu)
- [x] Configurar diretório `/data/manuals/` com permissões corretas
- [ ] Implementar Script de Download `bin/hvac-scout.mjs` [/]
- [ ] Configurar Docling com suporte a CUDA (GPU 3060) [ ]
- [ ] Desenvolver Pipeline de Tradução e Ingestão `bin/hvac-ingestor.mjs` [ ]
- [ ] Realizar teste de ponta a ponta (1 manual) [ ]
- [ ] Gerar Relatório de Desempenho de GPU e Ingestão [ ]

---
*Fase iniciada em 12/02/2026 - Modo Full-Auto Ativado*
