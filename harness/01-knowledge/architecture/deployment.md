# Deployment

## Arquitetura inicial

```
GitHub → Vercel → Next.js Application → Supabase
```

- **Vercel**: Next.js, frontend, backend web, deployments, preview deployments — ver [ADR-006](../decisions/adr/006-vercel-as-initial-web-host.md).
- **Supabase**: database, auth, storage, RLS, possíveis funções auxiliares — ver [ADR-005](../decisions/adr/005-supabase-as-data-platform.md).

## Processamento assíncrono

Não executar grandes workloads (Brand/Creator Discovery, enrichment, crawling, AI processing, geração de embeddings, recalculação de matches, monitoramento de campanhas, Opportunity discovery) dentro de HTTP requests. Separação Synchronous vs. Asynchronous Work, Edge Functions vs. Worker — ver [ADR-010](../decisions/adr/010-async-processing-strategy.md).

## Edge Functions

Supabase Edge Functions: webhooks, pequenas integrações, operações curtas, callbacks, pequenas chamadas de AI. Não devem ser a fundação de workloads pesados.

```
Short-lived integration work → Edge Function
Long-running / heavy processing → Worker
```

## Workers

Não criados agora. Arquitetura deve prever `Web Application + Worker` compartilhando codebase, módulos de domínio, PostgreSQL e contratos (ver [ADR-004](../decisions/adr/004-modular-monolith.md)). Primeira opção de hosting recomendada para worker, quando necessário: **Railway**.

```
Vercel   → Web
Supabase → PostgreSQL, Auth, Storage
Railway  → Worker
```

## Alternativas de hosting avaliadas

| Opção | Papel recomendado |
| --- | --- |
| **Vercel** | Preferred for web application MVP — integração nativa com Next.js, deploy simples, preview environments, baixo esforço operacional |
| **Railway** | Preferred future option para workers, long-running processes, background processing, jobs; também pode hospedar a aplicação web se necessário no futuro |
| **Render** | Alternativa válida para web services, background workers e cron jobs; não é a escolha inicial recomendada |
| **AWS / GCP** | Não utilizar inicialmente sem necessidade concreta; possível evolução futura quando requisitos enterprise, escala, compliance, networking ou infraestrutura especializada justificarem a complexidade |

## Evolução

Ver [`evolution.md`](evolution.md) para os estágios de evolução da infraestrutura (Stage 1–4) e os princípios que orientam quando adicionar cada peça nova.
