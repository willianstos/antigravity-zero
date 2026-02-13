---
name: frontend-architect
description: Define a estrutura Screaming Architecture para Next.js 15, baseada em repositórios top-star (shadboard, taxonomy).
---

# 🏗️ Frontend Architect (Screaming Architecture)

> Inspired by: `shadcn-ui/taxonomy` & `shadboard`

## 🧱 The Structure
Não jogue tudo em `/components`. Use Feature-Based folder structure.

```
frontend/dashboard/
├── app/                  # Next.js App Router (RSC)
│   ├── (auth)/           # Route Groups
│   ├── (dashboard)/      # Layout protegido
│   │   ├── audit/        # Page Audit
│   │   ├── ingest/       # Page Ingest
│   │   └── page.tsx      # Command Center
│   └── api/              # Route Handlers
├── components/
│   ├── ui/               # Componentes Shadcn Puros (NÃO MEXER)
│   ├── shared/           # Componentes globais (Header, Sidebar)
│   └── features/         # Componentes de Domínio (HVAC, RAG)
│       ├── ingest-terminal.tsx
│       ├── audit-table.tsx
│       └── memory-editor.tsx
├── lib/
│   ├── utils.ts          # cn() helper
│   ├── api.ts            # Typed fetch wrapper
│   └── store.ts          # Zustand store
└── types/                # Zod schemas & TS Interfaces
```

## 🧠 Rules
1.  **UI Isolation:** A pasta `components/ui` deve ser **intocável**. Se precisar customizar, crie um wrapper em `components/shared`.
2.  **Colocation:** Coloque estilos, testes e sub-componentes PERTO da feature que os usa.
3.  **Server vs Client:** Mantenha a árvore de componentes Server-Side o máximo possível. Use `"use client"` apenas nas folhas (leaf nodes) interativas.
