# SpinVero API — Fase 9.1

Backend inicial da plataforma SpinVero.

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod
- JWT + refresh token em cookie HttpOnly
- bcrypt

## Rodar

1. Instale as dependências dentro de `backend`.
2. Copie `.env.example` para `.env` e configure `DATABASE_URL`.
3. Gere o cliente Prisma.
4. Execute as migrations quando o PostgreSQL estiver disponível.
5. Inicie `npm run dev`.

## Endpoints atuais

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/products`
- `GET /api/products/:id`

O catálogo ainda não foi migrado dos mocks para o banco. Isso pertence à Fase 9.3.
