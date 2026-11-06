# SpinVero — Arquitetura Backend

## Objetivo

Preparar o frontend atual para sair de mocks/localStorage e passar a consumir uma API real sem reescrever a aplicação.

## Arquitetura alvo

```text
React + Vite + TypeScript
        ↓
Hooks / Contexts
        ↓
Services do domínio
        ↓
Repositories (API)
        ↓
REST API — Node.js + TypeScript
        ↓
Prisma ORM
        ↓
PostgreSQL
        ↓
Storage de arquivos (vídeos/imagens)
```

## Regra principal

As páginas e componentes não devem acessar PostgreSQL diretamente. O ponto de troca permanece nos repositories.

### Catálogo

```text
ProductService
    ↓
ApiProductRepository
    ↓
GET /api/products
    ↓
Backend
    ↓
Prisma
    ↓
PostgreSQL
```

O `MockProductRepository` continua sendo útil durante desenvolvimento/testes.

### Análises

```text
useAnalysis
    ↓
analysisService
    ↓
ApiAnalysisRepository + AnalysisProvider
    ↓
API / storage / futuro modelo de visão computacional
```

O arquivo de vídeo não deve ser salvo em localStorage nem como blob no PostgreSQL. O banco guarda metadados e uma chave de storage.

### Comunidade

```text
useCommunity
    ↓
communityService
    ↓
ApiCommunityRepository
    ↓
REST API
    ↓
PostgreSQL
```

## Autenticação

A implementação atual usa localStorage apenas como mock. Na Fase 9.1 será substituída por autenticação real:

- senha armazenada somente como hash;
- access token de curta duração;
- refresh token armazenado de forma segura e revogável;
- autorização por papel (`USER`, `ADMIN` e papéis futuros);
- rotas privadas verificadas no backend, não somente no frontend.

## Domínios da API

- `/api/auth`
- `/api/users`
- `/api/profiles`
- `/api/products`
- `/api/brands`
- `/api/reviews`
- `/api/analyses`
- `/api/posts`
- `/api/comments`
- `/api/progress`
- `/api/trainings`
- `/api/achievements`
- `/api/recommendations`
- `/api/admin` (Fase 9.5)

## Decisões

1. PostgreSQL: modelo relacional adequado para usuários, catálogo, comunidade e histórico.
2. Prisma: acesso tipado ao PostgreSQL e migrations versionadas.
3. REST primeiro: simples de integrar ao frontend atual.
4. Repositories: permitem manter mocks e trocar a origem dos dados gradualmente.
5. JSON é usado somente onde o formato é naturalmente variável (resultado de análise, snapshot de recomendação e alguns metadados), evitando transformar todo o banco em um documento sem estrutura.
