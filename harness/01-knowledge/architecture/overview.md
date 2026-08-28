# Visão geral da arquitetura

## Visão de alto nível

A Oxente Creator é construída inicialmente como um **Modular Monolith** — ver [ADR-004](../decisions/adr/004-modular-monolith.md): uma única codebase, um único deploy principal, um único PostgreSQL (via Supabase), com módulos de negócio de fronteiras explícitas. A arquitetura física permanece simples; a arquitetura lógica possui boas fronteiras. Isso otimiza para velocidade de desenvolvimento e de aprendizado, não para escala hipotética — ver [Architecture Fitness Principles em `evolution.md`](evolution.md#architecture-fitness-principles).

Documentos de arquitetura:

| Documento | Cobre |
| --- | --- |
| [`stack.md`](stack.md) | Stack técnica (linguagem, framework, dados, hosting, AI) |
| [`domain-architecture.md`](domain-architecture.md) | Bounded contexts como módulos, layering, Match vs Opportunity, matching pipeline, pastas conceituais |
| [`data-architecture.md`](data-architecture.md) | PostgreSQL como system of record, Evidence-first Intelligence, multi-tenancy |
| [`ai-architecture.md`](ai-architecture.md) | AI Provider Abstraction, agent architecture, evaluation |
| [`deployment.md`](deployment.md) | Vercel + Supabase, processamento assíncrono, alternativas de hosting |
| [`evolution.md`](evolution.md) | Fitness principles, non-goals, evolution path, decisões em aberto |
| [`context-map.md`](context-map.md) | Relação entre os 4 Graphs de produto (Creator/Brand/Opportunity/Deal) |

Este documento (`overview.md`) trata de **modelagem de domínio conceitual** (bounded contexts), não de arquitetura física — não assumir que cada domínio abaixo vira um microsserviço. Ver [`../product/vision.md`](../product/vision.md) para a visão de produto que motiva esses domínios.

## Domínios

Bounded contexts candidatos para o produto Oxente Creator:

| Domínio | Status | Detalhe |
| --- | --- | --- |
| Creator | Modelado | [`../domains/creator.md`](../domains/creator.md) |
| Brand | Modelado | [`../domains/brand.md`](../domains/brand.md) |
| Opportunity (inclui Match/MatchReason) | Modelado | [`../domains/opportunity.md`](../domains/opportunity.md) |
| Deal / Commercial | Modelado | [`../domains/deal.md`](../domains/deal.md) |
| Matching | Ver nota abaixo | — |
| Campaign | Futuro (estágio NEXT/THEN) | ainda não modelado |
| Content | Futuro (estágio LATER) | ainda não modelado |
| Operations | Futuro (estágio FUTURE) | ainda não modelado |
| Venture | Futuro (estágio FUTURE) | ainda não modelado |

> **Nota — Matching:** o brief de produto lista "Matching" como candidato a bounded context próprio, mas trata suas entidades (`Match`, `MatchReason`) como parte do Opportunity Domain (ver [`../domains/opportunity.md`](../domains/opportunity.md)). Mantemos assim por ora — Matching pode ser desacoplado como domínio próprio no futuro se a complexidade justificar, mas isso ainda não aconteceu.

Domínios "Futuro" não têm modelagem de entidade ainda — criar o respectivo `../domains/<nome>.md` apenas quando o roadmap ([`../product/roadmap.md`](../product/roadmap.md)) chegar naquele estágio, para evitar modelar prematuramente algo que ainda pode mudar.
