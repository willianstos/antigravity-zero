---
name: shadcn-craftsman
description: Skill de composição de UI com Shadcn (Radix) e Tailwind, focando em A11y e composição de componentes.
---

# 🎨 Shadcn Craftsman (UI Composer)

> Inspired by: `shadcn/ui` & `radix-ui/primitives`

## 🧱 Padrão de Composição (Radix)
Shadcn = Radix Primitives + Tailwind.

Para criar componentes interativos acessíveis (como Tabs, Dialogs L3, Tooltips HVAC), não escreva `div-soup`. Use os primitivos do Radix via Shadcn.

```tsx
// components/tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs"

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  // ... Tailwind classes ...
))
```

## 📐 Layout System (Tailwind v4)
Em 2026, usamos Tailwind de forma semântica.

**1. Grid System (HVAC Audit Cards)**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {cards.map(c => <HVACCard ... />)}
</div>
```

**2. Flexbox (Header / Stats)**
```tsx
<header className="flex h-16 items-center justify-between border-b px-6">
  <BrandLogo />
  <UserMenu />
</header>
```

### Regras de A11y (Acessibilidade)
1.  **Forms:** Todo Input DEVE ter Label (`shadcn/form`).
2.  **Focus:** Não remova outline (`focus-visible`). Teste com teclado.
3.  **Contrast:** Use cores WCAG AA mínimas (contrast checker incluído no Shadcn).
