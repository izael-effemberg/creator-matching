# Evolution

## Architecture Fitness Principles

Princípios que orientam futuras decisões arquiteturais:

1. Optimize for learning before scale.
2. Managed infrastructure before custom infrastructure.
3. Modular monolith before distributed systems.
4. PostgreSQL before introducing another database.
5. Async processing for heavy workloads.
6. Domain capabilities before agent implementations.
7. Provider abstractions before provider lock-in.
8. Evidence before inference.
9. Explainability before opaque scores.
10. Explicit boundaries before microservices.
11. Product complexity is acceptable; infrastructure complexity must be justified.
12. Every new infrastructure component must solve a demonstrated problem.

## Non-Goals

O que deliberadamente **não** estamos fazendo agora — não significa "nunca", significa *not justified at the current product stage*:

- microservices;
- Kubernetes;
- Kafka;
- distributed event architecture;
- graph database;
- dedicated vector database;
- custom authentication;
- complex ML infrastructure;
- agent framework as platform foundation;
- multiple databases;
- service mesh;
- premature CQRS/event sourcing.

## Evolution Path

### Stage 1 — atual

Modular Monolith ([ADR-004](../decisions/adr/004-modular-monolith.md)) em Vercel + Supabase.

Capabilities: Creators, Brands, Matching, Opportunities.

### Stage 2

Adicionar background worker.

```
Vercel   → Web
Supabase → Data
Railway  → Worker
```

Ver [ADR-010](../decisions/adr/010-async-processing-strategy.md).

### Stage 3

Separar workloads apenas quando necessário. Candidatos possíveis: Discovery Worker, AI Processing, Data Enrichment.

### Stage 4

Extrair services somente quando existir benefício mensurável. Nunca usar "precisamos escalar" sem definir o problema concreto (ver Fitness Principle 12).

## Open Architecture Decisions

Não inventar respostas para o que ainda não foi decidido. Classificação: `DECIDED` · `PROPOSED` · `OPEN` · `DEFERRED`.

| Decisão | Status |
| --- | --- |
| Modular monolith como arquitetura inicial | DECIDED — [ADR-004](../decisions/adr/004-modular-monolith.md) |
| Supabase como data platform | DECIDED — [ADR-005](../decisions/adr/005-supabase-as-data-platform.md) |
| Vercel como host web inicial | DECIDED — [ADR-006](../decisions/adr/006-vercel-as-initial-web-host.md) |
| Workspace como fronteira de multi-tenancy | DECIDED — [ADR-007](../decisions/adr/007-workspace-multitenancy.md) |
| AI provider abstraction | DECIDED — [ADR-008](../decisions/adr/008-ai-provider-abstraction.md) |
| Evidence-first intelligence | DECIDED — [ADR-009](../decisions/adr/009-evidence-first-intelligence.md) |
| Estratégia sync/async | DECIDED — [ADR-010](../decisions/adr/010-async-processing-strategy.md) |
| Observability stack (Pino + Sentry) | PROPOSED — [`../../04-feedback/observability/strategy.md`](../../04-feedback/observability/strategy.md) |
| Testing stack (Vitest + Playwright) | PROPOSED — [`../../04-feedback/tests/strategy.md`](../../04-feedback/tests/strategy.md) |
| Estratégia definitiva de jobs (fila, scheduler, retry) | OPEN |
| Serviço de search/crawling para Brand/Creator Discovery | OPEN |
| Estratégia de enrichment (fontes, frequência, custo) | OPEN |
| Provider principal de LLM | OPEN |
| Observability provider definitivo (Sentry é proposta, não decisão fechada) | PROPOSED |
| Definição final de API style (REST puro, RPC, outro) | OPEN |
| Deployment definitivo de workers (Railway é proposta, não decisão fechada até existir workload) | PROPOSED |
| Lifecycle de embeddings (quando gerar, invalidar, versionar) | OPEN |
| Versionamento de Match Score (como lidar com mudança de modelo ao longo do tempo) | OPEN |
| Storage de prompts (versionamento, auditoria) | OPEN |
| Evaluation framework para AI (ferramenta concreta) | DEFERRED — princípio registrado em [`../../04-feedback/evals/strategy.md`](../../04-feedback/evals/strategy.md), ferramenta não escolhida |
| RLS policies concretas por recurso | DEFERRED — depende de schema ainda não desenhado |
| Schema concreto de Evidence (tabelas, tipos) | DEFERRED — depende de implementação do ADR-009 |
