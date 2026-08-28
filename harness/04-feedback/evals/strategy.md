# AI Evaluation Strategy

> Princípio registrado — ferramenta/framework concreto ainda não escolhido (ver [`../../01-knowledge/architecture/evolution.md`](../../01-knowledge/architecture/evolution.md#open-architecture-decisions), item DEFERRED).

## Princípio

Avaliar separadamente:

1. **Qualidade de matching** — precisão das dimensões de fit e do Match/Opportunity Score (ver [`../../01-knowledge/product/intelligence/matchmaking.md`](../../01-knowledge/product/intelligence/matchmaking.md)) frente a outcomes reais registrados no Deal Graph (ver [`../../01-knowledge/domains/deal.md`](../../01-knowledge/domains/deal.md)).
2. **Qualidade de outputs generativos** — explicações de match, suggested pitch, suggested activation — avaliados por critérios próprios (clareza, correção factual, utilidade), não pelos mesmos critérios de precisão de matching.

Isso é distinto de teste de software tradicional (ver [`../tests/strategy.md`](../tests/strategy.md)) — outputs de AI não têm um único resultado "correto" verificável por assert direto na maioria dos casos.

## Relação com Evidence-first Intelligence

Avaliar matching depende de conseguir rastrear de qual evidência/sinal uma conclusão veio — ver [ADR-009](../../01-knowledge/decisions/adr/009-evidence-first-intelligence.md). Sem isso, não é possível auditar por que um score estava errado.

## Status

DEFERRED — framework/ferramenta concreto de evaluation não definido nesta tarefa.
