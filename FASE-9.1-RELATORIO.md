# SpinVero — Fase 9.1

## Entrega

A Fase 9.1 cria a primeira versão real do servidor da plataforma, preservando o frontend React existente e o schema PostgreSQL/Prisma definido na Fase 9.0.

## Backend criado

- `backend/` separado do frontend.
- Node.js + TypeScript.
- Express para a API REST.
- Prisma para acesso ao PostgreSQL.
- Zod para validação de entrada.
- bcrypt para hash de senha.
- JWT para access token.
- Refresh token aleatório armazenado apenas como hash no banco e enviado em cookie HttpOnly.
- Helmet, CORS e limites básicos de JSON.
- Encerramento gracioso do Prisma/servidor.

## Endpoints

### Health
- `GET /health`

### Autenticação inicial
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Catálogo inicial
- `GET /api/products`
- `GET /api/products/:id`

A consulta de produtos já suporta paginação, busca e categoria.

## Decisões de arquitetura

O frontend ainda não foi forçado a usar a API nesta fase. Isso evita quebrar o sistema atual antes da migração dos dados.

Fluxo futuro:

`React → Service → API Repository → REST API → Prisma → PostgreSQL`

Atualmente o frontend continua usando seus repositórios mockados. A troca do repositório do catálogo será feita na Fase 9.3.

## Próximos passos

- 9.2: autenticação real integrada ao frontend e perfis persistentes.
- 9.3: migração do catálogo mock para PostgreSQL e API.
- 9.4: comunidade, análises e progresso persistentes.
- 9.5: painel administrativo.
- 9.6: integração final, segurança, testes e deploy.

## Validação

O ambiente desta execução não possui as dependências do backend instaladas e não possui acesso de rede para baixá-las. Por isso não foi possível executar `npm install`, gerar o Prisma Client ou iniciar o servidor nesta sessão.

Os arquivos de configuração e código foram criados para serem executados após a instalação das dependências e configuração do PostgreSQL.
