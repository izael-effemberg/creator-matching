# AI Architecture

## Provider abstraction

Não acoplar o domínio a um provider específico — ver [ADR-008](../decisions/adr/008-ai-provider-abstraction.md) para o princípio completo e o racional.

```
Application Capability → AI Interface → Provider Adapter
```

Exemplo: `Match Explanation → Language Model abstraction → Anthropic Adapter (ou OpenAI Adapter)`.

## Agent architecture

Não organizar a arquitetura do sistema ao redor de frameworks de agentes (LangChain, LangGraph, CrewAI ou similares) — eles podem ser detalhe de implementação dentro de um adapter, não fundação arquitetural. `Product Capability != Agent` — ver [`../product/agents-overview.md`](../product/agents-overview.md) para a distinção completa e o mapeamento capability→agente.

Os agentes conceituais futuros são tratados como **application/workflow actors**, não bounded contexts — ver [`domain-architecture.md`](domain-architecture.md#agent-architecture-princípio-de-domínio).

## Matching architecture

O Match Score não é uma resposta simples gerada por LLM. Pipeline conceitual completo em [`domain-architecture.md`](domain-architecture.md#matching-architecture): Feature Extraction → Scoring/Ranking → Match → LLM Explanation, evoluindo de heurísticas para scoring ponderado, ranking guiado por feedback e, no limite, learning-to-rank/ML.

## Evidence-first Intelligence

Toda inferência de AI (Brand budget signals, Creator affinity, scores) deve manter proveniência — ver [ADR-009](../decisions/adr/009-evidence-first-intelligence.md).

## Observability de AI

Chamadas de AI são um caso especial de observabilidade — custo e latência de LLMs, rastreabilidade de Opportunity generation — ver [`../../04-feedback/observability/strategy.md`](../../04-feedback/observability/strategy.md).

## Evaluation

Qualidade de matching e qualidade de outputs generativos (explicações, pitches sugeridos) devem ser avaliadas separadamente — ver [`../../04-feedback/evals/strategy.md`](../../04-feedback/evals/strategy.md).
