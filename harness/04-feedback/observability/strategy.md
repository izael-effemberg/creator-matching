# Observability Strategy

> Stack candidata, proposta — não instalada. Ver [`../../01-knowledge/architecture/ai-architecture.md`](../../01-knowledge/architecture/ai-architecture.md#observability-de-ai) para o caso específico de observabilidade de AI.

## Stack candidata

- **Pino** — structured logs.
- **Sentry** — errors/tracing.

## Princípios

- Structured logging em toda a aplicação, não `console.log` livre.
- Correlation identifiers quando necessário, para rastrear uma requisição/job através de múltiplas etapas.
- Observabilidade de chamadas de AI: custo e latência de LLMs por chamada.
- Observabilidade de jobs (quando workers existirem — ver [ADR-010](../../01-knowledge/decisions/adr/010-async-processing-strategy.md)).
- Rastreabilidade de Opportunity generation — de qual sinal/evidência uma Opportunity específica se originou (ver [ADR-009](../../01-knowledge/decisions/adr/009-evidence-first-intelligence.md)).

## Status

PROPOSED, não DECIDED — ver [`../../01-knowledge/architecture/evolution.md`](../../01-knowledge/architecture/evolution.md#open-architecture-decisions). Provider definitivo de observability (Sentry vs. alternativas) ainda não fechado.
