# Visão geral da arquitetura

## Visão de alto nível

Este documento trata de **modelagem de domínio conceitual** (bounded contexts), não de arquitetura física — não assumir que cada domínio abaixo vira um microsserviço. Ver [`../product/vision.md`](../product/vision.md) para a visão de produto que motiva esses domínios e [`context-map.md`](context-map.md) para como eles se relacionam.

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
