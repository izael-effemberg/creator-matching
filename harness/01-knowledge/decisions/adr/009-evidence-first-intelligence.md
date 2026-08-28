# ADR-009 — Evidence-First Intelligence

## Status

Accepted

## Context

Boa parte dos dados do produto (Brand budget signals, Creator affinity, Match/Opportunity scores) é descoberta ou inferida por AI, não informada diretamente por um usuário. Se armazenarmos apenas a conclusão (ex.: `budget = HIGH`), perdemos a capacidade de explicar, auditar, recalcular ou identificar dados desatualizados — o que conflita diretamente com a exigência de explicabilidade do produto (why them / why this / why now — ver [`../../product/vision.md`](../../product/vision.md#core-product)).

## Decision

Não armazenar apenas a conclusão de um dado inferido. Armazenar a cadeia completa:

```
SOURCE → EVIDENCE → SIGNAL → FEATURE → MATCH → OPPORTUNITY
```

Exemplo conceitual: em vez de armazenar apenas `budget = HIGH` para uma marca, representar também `source`, `evidence`, `discovered_at`, `confidence`, `signal type` e `derived value`.

Este princípio é registrado como **Evidence-first Intelligence** e se aplica a todo dado inferido por AI no produto (ver [`../../product/intelligence/matchmaking.md`](../../product/intelligence/matchmaking.md) e [`../../product/intelligence/opportunity-engine.md`](../../product/intelligence/opportunity-engine.md)). O schema concreto para representar essa cadeia não é definido nesta tarefa — é FOLLOW-UP de implementação.

## Rationale

- Explainability é requisito de produto, não opcional (ver [ADR-002](002-opportunity-as-core-entity.md) e [`../../product/intelligence/matchmaking.md`](../../product/intelligence/matchmaking.md#explainability)).
- Auditoria: permite entender por que o sistema chegou a uma conclusão específica.
- Recálculo: permite reprocessar Match/Opportunity quando o modelo ou os sinais mudam, sem perder o histórico do que gerou a conclusão anterior.
- Identificação de dados desatualizados: `discovered_at` e `confidence` permitem saber quando uma inferência precisa ser revalidada.

## Alternatives Considered

- **Armazenar apenas o valor final inferido** — rejeitado: mais simples no curto prazo, mas inviabiliza explainability, auditoria e recálculo — que são centrais à tese do produto.
- **Logs externos separados do dado em si (ex.: só em observability, não no banco)** — rejeitado como única fonte: logs de observability têm retenção limitada e não são desenhados para recálculo de domínio; evidence precisa ser parte do modelo de dados, não só do log operacional (ver [`../../architecture/data-architecture.md`](../../architecture/data-architecture.md)).

## Consequences

### Positive

- Todo Match/Opportunity pode vir acompanhado de uma explicação rastreável até a fonte.
- Reprocessamento de scoring não depende de re-coletar evidência do zero.
- Base necessária para medir e melhorar a precisão do matching ao longo do tempo (ver `Opportunity Precision` em [`../../product/metrics.md`](../../product/metrics.md)).

### Negative

- Aumenta o volume de dados armazenados e a complexidade de schema em relação a armazenar só a conclusão.
- Exige disciplina em todo pipeline de inferência para não "atalhar" e gravar só o valor final.

## When to Revisit

Não é uma decisão para revisitar por padrão — é um princípio estrutural. Revisitar apenas se o custo de armazenamento/complexidade de manter evidence completo se mostrar desproporcional ao benefício de explainability para uma classe específica de dado (caso a caso, não como princípio geral).
