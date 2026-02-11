# Frontend

> A implementar: Interface web para visualização dos dados.

## Stack sugerida
- **Framework:** Next.js ou Vite + React
- **Estilo:** TailwindCSS ou Vanilla CSS
- **Estado:** Zustand ou React Context

## Estrutura
```
frontend/
├── src/
│   ├── components/   ← Componentes reutilizáveis
│   ├── pages/        ← Páginas/rotas
│   ├── hooks/        ← Custom hooks
│   ├── utils/        ← Funções utilitárias
│   └── App.jsx       ← Entry point
├── public/           ← Assets estáticos
└── tests/            ← Testes
```

## Quick Start
```bash
cd frontend
npx -y create-vite@latest ./ -- --template react
npm install
npm run dev
```
