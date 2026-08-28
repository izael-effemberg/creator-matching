# Testing Strategy

> Stack candidata, proposta — não instalada.

## Stack candidata

- **Vitest** — unit e integration tests.
- **Playwright** — E2E.

## Estratégia por camada

- **Unit tests** — domain logic (ver [`../../01-knowledge/architecture/domain-architecture.md`](../../01-knowledge/architecture/domain-architecture.md) para as fronteiras de domínio a testar).
- **Integration tests** — database / application workflows.
- **E2E** — critical user journeys.
- **AI evaluation** — avaliada separadamente, não como teste tradicional — ver [`../evals/strategy.md`](../evals/strategy.md).

## Onde vive o quê

Esta pasta guarda estratégia e config de teste; o código de teste em si continua junto do código-fonte (`src/**/*.test.ts` ou equivalente) — ver [`../README.md`](../README.md).

## Status

PROPOSED, não DECIDED.
