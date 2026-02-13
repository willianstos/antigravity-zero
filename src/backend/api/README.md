# Backend API

> A implementar: API REST para expor dados do scraping.

## Stack sugerida
- **Runtime:** Node.js 20+
- **Framework:** Fastify ou Express
- **Banco:** Redis (já configurado como vault) + SQLite/PostgreSQL
- **Scraping:** Playwright + Firecrawl (já implementado)

## Estrutura
```
api/
├── routes/          ← Endpoints da API
├── middleware/       ← Auth, rate limit, etc
├── controllers/     ← Lógica de negócio
└── index.mjs        ← Entry point
```

## Quick Start
```bash
cd backend/api
npm init -y
npm install fastify
node index.mjs
```
