# Data Architecture

## System of record

**PostgreSQL (via Supabase) será inicialmente o system of record** — ver [ADR-005](../decisions/adr/005-supabase-as-data-platform.md). Não introduzir prematuramente MongoDB, Neo4j, Elasticsearch, Redis, Pinecone, vector databases dedicados ou graph databases.

O fato de o produto falar em Creator Graph, Brand Graph, Opportunity Graph e Deal Graph (ver [`../product/vision.md`](../product/vision.md#product-graph)) não significa que precisamos de um graph database — "Graph" neste momento representa uma visão de relacionamento do domínio, modelável em tabelas relacionais.

## Evidence-first Intelligence

Princípio central para dados descobertos ou inferidos por AI — ver [ADR-009](../decisions/adr/009-evidence-first-intelligence.md) para o racional completo. Resumo:

Não armazenar apenas a conclusão:

```
SOURCE → EVIDENCE → SIGNAL → FEATURE → MATCH → OPPORTUNITY
```

Exemplo: em vez de `budget = HIGH`, representar `source`, `evidence`, `discovered_at`, `confidence`, `signal type`, `derived value`. Isso viabiliza explainability, auditoria, recálculo e identificação de dados desatualizados — capabilities exigidas pela tese do produto (why them / why this / why now).

## Multi-tenancy

Isolamento de dados por workspace, garantido no nível do banco por Row Level Security — ver [ADR-007](../decisions/adr/007-workspace-multitenancy.md). Modelo conceitual: `User → Membership → Workspace → Resources`. Policies concretas não são definidas nesta tarefa.

## Access pattern

Preferência inicial por Supabase SDK, SQL direto e generated TypeScript types em vez de um ORM — ver [ADR-005](../decisions/adr/005-supabase-as-data-platform.md#decision). Aproveitar recursos nativos do Postgres quando fizer sentido: RLS, JSONB, indexes, Full Text Search e, futuramente, pgvector.

## Relação com os domínios

Este documento descreve princípios de dados transversais. A modelagem de entidade por domínio (Creator, Brand, Opportunity, Deal) está em [`../domains/`](../domains/); a relação entre os quatro Graphs está em [`context-map.md`](context-map.md).
