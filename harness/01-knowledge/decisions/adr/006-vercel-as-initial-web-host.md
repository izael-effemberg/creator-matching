# ADR-006 — Vercel as the Initial Web Host

## Status

Accepted

## Context

A aplicação web (Next.js) precisa de um destino de deploy simples, com baixo esforço operacional, desde o início (consistente com [ADR-004](004-modular-monolith.md)).

## Decision

Vercel será o hosting inicial preferencial para a aplicação Next.js. Arquitetura inicial:

```
GitHub → Vercel → Next.js Application → Supabase
```

Railway permanece como provável opção futura para workers e processamento assíncrono pesado, quando esse workload surgir (ver [ADR-010](010-async-processing-strategy.md) e [`../../architecture/evolution.md`](../../architecture/evolution.md)).

## Rationale

- Integração nativa com Next.js (o framework escolhido — ver [`../../architecture/stack.md`](../../architecture/stack.md)).
- Deploy simples, preview deployments por PR, baixo esforço operacional.
- Consistente com o princípio de infraestrutura gerenciada antes de infraestrutura customizada.

## Alternatives Considered

- **Railway para a aplicação web também** — viável, mas Vercel tem integração mais direta com Next.js para o caso de uso web/frontend; Railway fica reservado como primeira opção para workers.
- **Render** — alternativa válida para web services, background workers e cron jobs, mas não é a escolha inicial recomendada; sem vantagem clara sobre Vercel para este caso de uso.
- **AWS / GCP** — rejeitado por ora: complexidade de infraestrutura não justificada neste estágio; possível evolução futura quando requisitos enterprise, escala, compliance, networking ou infraestrutura especializada justificarem.

## Consequences

### Positive

- Deploy e preview environments prontos sem configuração de infraestrutura.
- Foco do time em produto, não em operação de servidores.

### Negative

- Vercel não é o ambiente natural para processamento de longa duração — não deve ser tratado como responsável por todo processamento assíncrono (ver [ADR-010](010-async-processing-strategy.md)).
- Introduz um segundo provedor (além do Supabase) na arquitetura de deploy.

## When to Revisit

- Necessidade de workloads de longa duração na própria aplicação web que a Vercel não suporte bem.
- Custo de Vercel se tornar desproporcional ao uso real.
- Requisitos de infraestrutura que exijam controle mais granular do que a Vercel oferece.
