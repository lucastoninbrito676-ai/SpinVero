# SpinVero

Plataforma esportiva para tênis de mesa.

## Frontend

React + Vite + TypeScript.

```bash
npm install
npm run dev
```

## Backend — Fase 9.1

Node.js + TypeScript + Express + Prisma + PostgreSQL.

```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

API local: `http://localhost:3333`

Health check: `GET /health`

O banco PostgreSQL precisa estar disponível para endpoints que usam Prisma.

## Arquitetura

`React → Services/Repositories → REST API → Node/Express → Prisma → PostgreSQL`

A Fase 9.1 cria a fundação do servidor. A migração completa do catálogo, comunidade, análises e demais dados acontece nas fases 9.2–9.6.
