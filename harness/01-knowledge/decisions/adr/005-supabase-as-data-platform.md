# ADR-005 — Supabase as the Initial Data Platform

## Status

Accepted

## Context

Precisamos de banco de dados, autenticação, storage e controle de acesso desde o início, sem montar essa infraestrutura manualmente, para manter velocidade de desenvolvimento e baixa complexidade operacional (consistente com [ADR-004](004-modular-monolith.md)).

## Decision

Supabase será a plataforma de dados inicial, tratada principalmente como **plataforma gerenciada sobre PostgreSQL**. Uso inicial:

- PostgreSQL (system of record — ver [`../../architecture/data-architecture.md`](../../architecture/data-architecture.md));
- Supabase Auth;
- Supabase Storage;
- Row Level Security como componente estrutural da arquitetura (ver [ADR-007](007-workspace-multitenancy.md));
- Supabase CLI / migrations;
- generated TypeScript types.

Disponíveis para uso futuro, quando necessário — não assumidos como parte do MVP: pgvector, Realtime, Edge Functions, Cron.

**Não introduzir prematuramente** MongoDB, Neo4j, Elasticsearch, Redis, Pinecone, dedicated vector databases ou graph databases. "Creator Graph", "Brand Graph", "Opportunity Graph" e "Deal Graph" (ver [`../../product/vision.md`](../../product/vision.md#product-graph)) são uma visão de relacionamento do domínio, não uma exigência de graph database.

**ORM:** não introduzir Prisma como dependência obrigatória. Preferência inicial por Supabase SDK, SQL direto, migrations do Supabase, PostgreSQL nativo e generated TypeScript types — para reduzir abstrações iniciais e aproveitar recursos nativos do Postgres (RLS, JSONB, indexes, Full Text Search, pgvector futuramente, functions/views quando necessário). Um ORM pode ser introduzido futuramente caso o benefício se torne claro; Drizzle pode ser avaliado no futuro, mas não é adotado agora.

## Rationale

- PostgreSQL managed + Auth + Storage + RLS + extensões cobre a maior parte das necessidades iniciais sem exigir integração de múltiplos serviços.
- Reduz superfície operacional: um único provedor de dados para banco, auth e storage.
- RLS nativo do Postgres é suficiente para os requisitos de isolamento por workspace conhecidos hoje (ver [ADR-007](007-workspace-multitenancy.md)).
- Evita lock-in desnecessário: core business data permanece em PostgreSQL, um banco relacional padrão, portável para fora do Supabase se necessário.

## Alternatives Considered

- **Banco de dados customizado auto-hospedado** — rejeitado: aumenta complexidade operacional sem benefício demonstrado neste estágio.
- **Graph database (Neo4j etc.) para os "Graphs" do produto** — rejeitado: os Graphs de produto são um modelo conceitual de relacionamento, não uma exigência de armazenamento em grafo; PostgreSQL relacional (com JSONB e relações explícitas) é suficiente.
- **Vector database dedicado (Pinecone etc.)** — rejeitado por ora: pgvector no Postgres cobre a necessidade quando embeddings forem introduzidos, sem exigir mais um sistema de dados.
- **Múltiplos bancos especializados por tipo de dado (search, cache, etc.)** — rejeitado: adiciona complexidade não justificada pelo estágio atual do produto.

## Consequences

### Positive

- Time-to-first-feature reduzido — auth, storage e banco prontos desde o início.
- Um único system of record simplifica consistência e observabilidade.
- Caminho de expansão (pgvector, Realtime, Edge Functions, Cron) já disponível na mesma plataforma quando necessário.

### Negative

- Acoplamento a decisões operacionais do Supabase (ex.: modelo de billing, limites de Edge Functions) para os recursos usados além do Postgres puro.
- RLS mal desenhado pode se tornar fonte de bugs de segurança sutis se não for tratado como parte central da arquitetura.

## When to Revisit

- Volume ou padrão de acesso a dados que exija um banco especializado (ex.: search em larga escala, grafo de fato).
- Requisitos de compliance/infraestrutura que exijam controle total sobre o banco fora de uma plataforma gerenciada.
- Necessidade real de vector search em escala que pgvector não atenda mais.
