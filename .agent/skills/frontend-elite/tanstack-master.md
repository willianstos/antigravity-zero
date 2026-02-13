---
name: tanstack-master
description: Skill de dominação do TanStack Query e Table v8 para gerenciar Server State e Data Grids de Alta Performance (Audit Table).
---

# 🔄 TanStack Master (Query & Table)

> Inspired by: `tanstack/query` & `shadcn-ui/table`

Em 2026, **não usamos `useEffect`** para fetch de dados. Usamos TanStack Query v5.
Em 2026, **não escrevemos `<table>` na mão**. Usamos TanStack Table v8.

## 🛠️ O Padrão de Fetch (Query)
Para buscar dados do Qdrant ou da API RAG:

```tsx
// hooks/use-hvac-manuals.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useHVACManuals(filter: FilterSchema) {
  return useQuery({
    queryKey: ['manuals', filter], // Invalidação automática por filtro
    queryFn: () => api.getManuals(filter),
    staleTime: 1000 * 60 * 5, // Cache por 5 min
  });
}
```

## 📊 O Padrão de Tabela (Table v8)
A `Audit Table` deve usar Shadcn `DataTable` component pattern:

```tsx
// components/data-table.tsx
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

// ... Shadcn Implementation ...
```

### Regras de Ouro
1.  **Server State:** React Query cuida do cache, refetching e loading states. Não faça manualmente.
2.  **Client State:** Se precisar de filtros ou paginação CLIENT-SIDE, use `useReactTable`.
3.  **Performance:** Paginação SERVER-SIDE sempre que possível para > 100 itens.
