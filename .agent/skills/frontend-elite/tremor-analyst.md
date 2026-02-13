---
name: tremor-analyst
description: Skill de Visualização de Dados (DataViz) focada em Dashboards de alto nível.
---

# 📊 Tremor Analyst (DataViz)

> Inspired by: `tremor.so` & `recharts`

Para a página **Command Center** do Dashboard, precisamos de gráficos sérios.
Não use `recharts` puro. Use **Tremor**.

## 📈 Components

1.  **KPI Blocks (Stats):**
```tsx
import { Card, Metric, Text } from "@tremor/react";

<Card className="max-w-xs mx-auto" decoration="top" decorationColor="emerald">
  <Text>Total Manuais Indexados</Text>
  <Metric>142</Metric>
</Card>
```

2.  **Activity Line (Timeline):**
```tsx
import { AreaChart } from "@tremor/react";

<AreaChart
  className="h-72 mt-4"
  data={chartData}
  index="date"
  categories={["Ingestões", "Rejeições"]}
  colors={["cyan", "rose"]}
/>
```

### Regras de Ouro
1.  **Contextualize:** Todo gráfico PRECISA de Tooltip e Legenda. Ninguém adivinha dados.
2.  **Responsividade:** Tremor já é responsive, mas use `ClassName="hidden md:block"` se o gráfico for muito complexo em mobile.
3.  **Loading State:** Enquanto `React Query` busca dados, mostre um Skeleton do Tremor (`h-72 animate-pulse bg-slate-200`).
