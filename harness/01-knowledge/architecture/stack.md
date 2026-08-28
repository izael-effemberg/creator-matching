# Stack

> Stack técnica recomendada para o estágio atual (Modular Monolith — ver [ADR-004](../decisions/adr/004-modular-monolith.md)). Nada aqui foi instalado; é a stack que orienta a próxima etapa de implementação. Fonte única de verdade sobre stack — não redefinir em `../constitution.md`, apenas linkar para cá.

## Language

**TypeScript**

Motivo: linguagem única para frontend/backend; bom ecossistema; ótima integração com Next.js; bom suporte a SDKs de AI; alta produtividade.

## Runtime

**Node.js LTS**

## Application Framework

**Next.js**

Responsabilidades iniciais: frontend, SSR quando necessário, backend HTTP, server-side application logic, API endpoints. Não assumir Next.js como responsável por todo processamento de longa duração — ver [ADR-010](../decisions/adr/010-async-processing-strategy.md).

## Frontend

**React**, com **Tailwind CSS** e **shadcn/ui** para UI.

## Validation / Contracts

**Zod** — usado conceitualmente para validação de inputs, schemas, contratos de API e structured outputs de AI.

## Data Platform

**Supabase** — ver [ADR-005](../decisions/adr/005-supabase-as-data-platform.md) e [`data-architecture.md`](data-architecture.md) para o racional completo.

## Hosting

**Vercel** (aplicação web) + **Supabase** (dados) — ver [ADR-006](../decisions/adr/006-vercel-as-initial-web-host.md) e [`deployment.md`](deployment.md).

## AI

Múltiplos providers possíveis (Anthropic, OpenAI, outros), sempre atrás de uma AI Provider Abstraction — ver [ADR-008](../decisions/adr/008-ai-provider-abstraction.md) e [`ai-architecture.md`](ai-architecture.md).

## Observability e Testing (candidatas, não instaladas)

- Observability: Pino (structured logs) + Sentry (errors/tracing) — ver [`../../04-feedback/observability/strategy.md`](../../04-feedback/observability/strategy.md).
- Testing: Vitest + Playwright — ver [`../../04-feedback/tests/strategy.md`](../../04-feedback/tests/strategy.md).

## O que deliberadamente não está na stack agora

Ver [Non-Goals em `evolution.md`](evolution.md#non-goals) — inclui Prisma como dependência obrigatória, frameworks de agente como fundação, bancos adicionais (graph DB, vector DB dedicado), microservices, Kubernetes, Kafka.
