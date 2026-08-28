# ADR 002: Opportunity como entidade central do produto

## Status

Accepted

## Contexto

O problema que a Oxente Creator resolve não é apenas descobrir creators, nem apenas descobrir marcas. É identificar relações comerciais com maior probabilidade de gerar valor. Modelar o produto em torno de Creator ou Brand como entidade central levaria naturalmente a um produto de *descoberta/diretório* (busca e filtros), não a um produto de *inteligência comercial*.

Compatibilidade entre creator e marca (Match) por si só não é suficiente para justificar uma ação comercial: falta o contexto de por que agora.

## Decisão

Adotar **Opportunity** — `Creator + Brand + Context + Timing + Commercial Hypothesis` — como a unidade fundamental do produto, distinta de **Match** (mera compatibilidade). Toda a modelagem de dados (Product Graph, ver [`../../product/vision.md`](../../product/vision.md#product-graph)) e a sequência de capabilities do roadmap são construídas progressivamente em torno dessa entidade.

## Consequências

- O domínio "Opportunity" (ver [`../../domains/opportunity.md`](../../domains/opportunity.md)) precisa modelar explicitamente `Match`, `MatchReason`, `OpportunityScore`, `CommercialHypothesis`, `SuggestedActivation` e `TimingSignal` como conceitos distintos, não como sinônimos de "compatibilidade".
- O produto de matchmaking não pode entregar apenas um score — precisa explicar why them / why this / why now (ver [`../../product/intelligence/matchmaking.md`](../../product/intelligence/matchmaking.md)).
- O roadmap prioriza Matchmaking e Opportunity Recommendation no estágio NOW antes de qualquer outra capability (ver [`../../product/roadmap.md`](../../product/roadmap.md)).
- O Deal Graph (outcome real de uma Opportunity) se torna candidato a moat do produto, e não a base de creators/marcas cadastradas — ver [`../../product/strategy.md`](../../product/strategy.md#por-que-conseguimos-vencer-moat).
