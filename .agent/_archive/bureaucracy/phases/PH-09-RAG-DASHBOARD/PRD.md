# PRD: Dashboard RAG HVAC (Super Phase II)

> **Fase:** PH-09-RAG-DASHBOARD
> **Status:** Planning (Aguardando Execução)
> **Goal:** Construir o Frontend definitivo para Auditoria, Busca e Treinamento do RAG.
> **Tema:** "Ethical Chic" (Minimalismo, Confiança, Clareza).

## 🎯 Objetivo de Design (Vibe 2026)
Criar uma interface que pareça um **instrumento médico de precisão**, não um site de jogo.
- **Paleta Sovereign Future 2025:** 
  - `Base:` **Future Dusk** (#2D315E) - Deep blue-violet para imersão técnica.
  - `Surface:` Slate Mist (Neutros calibrados para redução de fadiga ocular).
  - `Accents:` **Forest Emerald** (Sucesso/HVAC), **Electric Indigo** (IA/Search), **Amber Glow** (Audit/VIP).
- **Tipografia:** Geist Mono (Dados/Logs) + Inter (Interface).
- **Componentes:** Shadcn/UI (Radix) + Tremor (DataViz).
- **Sutileza:** Vidro fosco (Glassmorphism 15% opacity), bordas de 1px com cores hex-alpha.

## 👥 Times & Skills (Agentes & Skills Mapeadas)
- **Frontend Architect:** `shadcn-architect.md` (Responsável pela Estrutura)
- **Data Analyst:** `tremor-analyst.md` (Responsável pelos Gráficos)
- **UI Craftsman:** `shadcn-craftsman.md` (Responsável pelos Componentes)
- **State Master:** `tanstack-master.md` (Responsável por React Query/Tables)
- **Perf Engineer:** `next-perf-engineer.md` (Responsável por RSC)

## 🏗️ Arquitetura Técnica
- **Framework:** Next.js 15 (App Router).
- **Estilo:** Tailwind CSS + Shadcn/UI (Radix).
- **State:** TanStack Query v5 + Zustand.
- **Data Grid:** TanStack Table v8.
- **Charts:** Tremor v2.

## 🖥️ Telas & Wireframes

### 1. **Command Center (Home)**
- **Skill:** `tremor-analyst.md`
- **Componentes:** KPI Cards (Tremor), Timeline Chart (Tremor).
- **Header:** Status do Qdrant (🟢 Online), Total de Manuais (🔢 142).

### 2. **Ingestão (Upload)**
- **Skill:** `shadcn-craftsman.md`
- **Componentes:** Dropzone Area (Radix), Real-time Terminal Log.
- **Backend:** `next-perf-engineer.md` (Route Handler /api/ingest).

### 3. **Audit Lab (Auditoria)**
- **Skill:** `tanstack-master.md`
- **Data Grid:** TanStack Table v8 com Sorting, Filtering e Pagination Server-Side.
- **Colunas:** Nome, Marca, Modelo, Status, Score, Ações.

### 4. **Memory Bank (L3 Editor)**
- **Editor de Fatos:** Interface para ver o que o bot "aprendeu" na collection `hvac-facts`.
- **CRUD:** Adicionar manualmente um fato (ex: "Dica de campo: Erro E4 na praia oxida rápido").
- **Validação:** Checkbox "Verificado por Humano ✅".

## 📦 Lista de Tarefas (Execution Plan)

### Setup
- [ ] Inicializar projeto Next.js (`npx create-next-app@latest frontend/dashboard`).
- [ ] Instalar Shadcn/UI + Tremor (`npx shadcn-ui@latest init`).
- [ ] Configurar tema "Ethical Chic" no `tailwind.config.js`.

### Backend Integration
- [ ] Criar API Routes no Next.js que chamam os scripts do `backend/rag/`.
- [ ] Endpoint `/api/search`: Chama `hvac-search.mjs`.
- [ ] Endpoint `/api/ingest`: Upload de arquivo + `hvac-ingest.mjs`.
- [ ] Endpoint `/api/stats`: Consulta Qdrant collections.

### Frontend Build
- [ ] Implementar **Command Center** (Busca + Stats).
- [ ] Implementar **Ingestion Page** (Upload + Logs WebSocket).
- [ ] Implementar **Audit Table** (Data Grid Shadcn).
- [ ] Implementar **Memory Editor** (Fatos L3).

### Polish
- [ ] Adicionar micro-interações (loading skeletons, toasts de sucesso).
- [ ] Validar responsividade (Tablet/Desktop).

## 🚀 Como Iniciar
```bash
openclaw taskmaster start PH-09-RAG-DASHBOARD //full-auto
```
