# SpinVero — Modelo de Dados (Fase 9.0)

O arquivo `prisma/schema.prisma` é a fonte de verdade do modelo proposto.

## Núcleo de usuários

- `User`: conta, identidade e papel.
- `AuthSession`: sessões/refresh tokens revogáveis.
- `Profile`: perfil esportivo e preferências de recomendação.

## Catálogo

- `Brand`
- `Product`
- `ProductImage`
- `Tag` / `ProductTag`
- `BladeSpecs`
- `RubberSpecs`
- `RacketSpecs`
- `AccessorySpecs`
- `RacketComponent`
- `ProductReview`

O produto base fica separado das especificações por categoria. Isso mantém consultas e regras claras sem colocar dezenas de campos opcionais em uma única tabela.

## Análise e evolução

- `Analysis`: execução da análise, vídeo e metadados do provider.
- `AnalysisResult`: resultado versionado da análise.
- `Progress`: série histórica de métricas.
- `Training`: registro de treinos.
- `Achievement` / `UserAchievement`: conquistas.
- `Recommendation`: snapshot de uma recomendação gerada.

A recomendação é salva como snapshot (`payload`) porque o catálogo e o perfil podem mudar depois. Isso preserva exatamente o que foi recomendado naquele momento.

## Comunidade

- `Post`
- `Comment`
- `PostLike`
- `PostReport`
- `Tag` / `PostTag`
- `PostEquipment`

As tabelas de relação evitam duplicidade e permitem constraints de unicidade, por exemplo um usuário só pode curtir o mesmo post uma vez.

## Administração e auditoria

`AuditLog` já está previsto para a futura área administrativa. A interface do painel será implementada somente na Fase 9.5.

## Integridade importante

- e-mail de usuário é único;
- nome de marca e código de achievement são únicos;
- review de um produto por usuário é única;
- like de um usuário em um post é único;
- report de um usuário para um post é único;
- IDs de produtos de uma raquete apontam para produtos existentes;
- exclusões em cascata são usadas para dados dependentes;
- produtos e marcas não são apagados em cascata entre si, preservando integridade do catálogo;
- preços usam `Decimal`, não `float`;
- datas usam `DateTime`.

## Fases seguintes

### 9.1
Criar backend Node/TypeScript, Prisma Client, migrations, health check e primeiros endpoints.

### 9.2
Trocar autenticação mock por autenticação real e migrar usuários.

### 9.3
Migrar catálogo para PostgreSQL e criar endpoints de catálogo/admin básico.

### 9.4
Persistir comunidade, reviews, análises e progresso.

### 9.5
Construir painel administrativo.

### 9.6
Integração final, segurança, testes, observabilidade e deploy.
