# SpinVero — Fase 9.2 — Autenticação real

## Entregue

A autenticação do frontend foi migrada do mock/localStorage para a API real criada na Fase 9.1.

### Backend
- Cadastro real em PostgreSQL via Prisma.
- Login real com bcrypt.
- Access token JWT mantido em memória no frontend.
- Refresh token aleatório armazenado apenas como hash no banco e enviado em cookie HttpOnly.
- Rotação de refresh token.
- Logout revoga a sessão.
- Endpoint `/api/auth/me`.
- Endpoint `/api/auth/refresh`.
- Atualização do usuário autenticado em `/api/auth/me`.
- Perfil esportivo em `/api/profile`.
- Perfil público em `/api/users/:id`.
- Validação com Zod.
- Mantidas rotas protegidas e autorização por papel existente.

### Frontend
- `authService` agora usa a API.
- `AuthContext` continua com a mesma interface para não quebrar as páginas existentes.
- Login e cadastro existentes continuam funcionando, agora contra o servidor.
- Sessão é restaurada usando o refresh cookie após recarregar a página.
- `ProfileContext` sincroniza perfil com PostgreSQL quando autenticado.
- Cache local continua apenas como fallback/compatibilidade.
- Perfil visitante continua funcionando antes do login.
- Perfil público usa API real.
- Mensagem de cadastro foi atualizada para não indicar que a conta é apenas local.

## Fluxo atual

```text
React
  ↓
AuthContext
  ↓
authService
  ↓
fetch / API
  ↓
Node + Express
  ↓
Prisma
  ↓
PostgreSQL
```

## Segurança

- Senha nunca chega ao banco em texto puro.
- Senha é armazenada como hash bcrypt.
- Refresh token não é armazenado em texto puro no banco.
- Refresh token fica em cookie HttpOnly.
- Access token não é persistido no localStorage.
- CORS usa origem configurada.
- Helmet permanece ativo.
- Dados de entrada são validados no backend.

## Dependência externa necessária para teste

O projeto precisa de um PostgreSQL acessível e das dependências instaladas. Isso não foi executado neste ambiente por não haver instalação/rede garantida.

Próxima fase: **9.3 — Catálogo real no PostgreSQL**.
