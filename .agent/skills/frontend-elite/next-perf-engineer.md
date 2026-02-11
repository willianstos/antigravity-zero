---
name: next-perf-engineer
description: Skill de otimização RSC (Server Components) e integração de API para não bloquear UI em Next.js 15.
---

# 🚀 Next.js Performance Engineer

> Inspired by: `vercel/next.js` & `react-perf`

O Dashboard não pode lagar. O servidor RAG é pesado, mas o Client não.

## ⚡ Server Components (RSC)
Toda página em `/app` é Server Component por padrão. Mantenha assim.

1.  **Ingestão de Dados:** Faça Fetch no Server Component se for SEO-crítico.
2.  **Streaming:** Use `Suspense` para blocks pesados (ex: Lista de Manuais).

```tsx
// app/dashboard/manuals/page.tsx
import { Suspense } from 'react';
import { ManualsTable } from '@/components/features/manuals-table';
import { ManualsSkeleton } from '@/components/skeletons/manuals';

export default function Page() {
  return (
    <Suspense fallback={<ManualsSkeleton />}>
      <ManualsTable />
    </Suspense> // O Shell carrega instantaneamente. Dados depois via RSC.
  );
}
```

## 🔒 API Integration (Route Handlers)
Nunca exponha lógica direta de DB no Client. Crie API Routes `/app/api/ingest/route.ts`.

1.  **Zod Validation:** Sempre valide input com `zod`.
2.  **Error Handling:** Retorne JSON `{ error: string }` estruturado.
3.  **Cache-Control:** Headers corretos para não cachear buscas dinâmicas (`max-age=0`).
