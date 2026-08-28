# ADR-008 — AI Provider Abstraction

## Status

Accepted

## Context

O produto depende fortemente de capabilities de AI (ver [`../../product/agents-overview.md`](../../product/agents-overview.md) e [`../../product/intelligence/matchmaking.md`](../../product/intelligence/matchmaking.md)), mas o mercado de LLM providers muda rápido — acoplar o domínio a um provider específico cria risco de lock-in e dificulta trocar ou combinar providers conforme custo/qualidade evoluem.

## Decision

O domínio da aplicação **não deve conhecer diretamente** Claude, GPT, Gemini ou qualquer provider específico. Registrar o princípio de **AI Provider Abstraction**:

```
Application Capability → AI Interface → Provider Adapter
```

Exemplo conceitual:

```
Match Explanation → Language Model abstraction → Anthropic Adapter (ou OpenAI Adapter)
```

Esta ADR registra o princípio arquitetural. Não define interfaces em código nesta tarefa — isso é FOLLOW-UP de implementação.

## Rationale

- Providers de LLM evoluem rápido em preço, qualidade e capabilities — a aplicação deve poder trocar ou combinar providers sem reescrever lógica de domínio.
- Capabilities como Match Explanation, Brand enrichment ou Creator profiling são conceitos de produto que devem sobreviver a qualquer provider específico.

## Alternatives Considered

- **Integração direta com um único SDK de provider em todo o domínio** — rejeitado: cria lock-in e espalha conhecimento de um provider específico por toda a aplicação.
- **Adotar um framework de agentes (LangChain, LangGraph, CrewAI) como fundação arquitetural** — rejeitado (ver princípio de Agent Architecture abaixo): esses frameworks podem ser usados como detalhe de implementação dentro de um adapter, mas não devem organizar a arquitetura do sistema.

## Consequences

### Positive

- Trocar ou combinar providers vira uma mudança de adapter, não uma mudança de domínio.
- Reduz o custo de experimentar novos providers/modelos.

### Negative

- Uma camada de abstração adicional tem custo de manutenção e pode esconder capabilities específicas de um provider que seriam vantajosas usar diretamente.

**Mitigação:** a abstração deve ser desenhada em torno das capabilities reais do produto (ex.: "gerar explicação de match"), não tentar generalizar para qualquer uso possível de LLM.

## Agent Architecture (princípio relacionado)

Não organizar a arquitetura do sistema ao redor de frameworks de agentes. `Product Capability != Agent`: Brand Discovery é uma product capability; Brand Intelligence Agent é uma possível implementação dela (ver [`../../product/agents-overview.md`](../../product/agents-overview.md)). O domínio Brand não deve depender da existência de um agente. Os agentes conceituais futuros (Brand Intelligence, Creator Intelligence, Matchmaking, Positioning, Content, Monetization/Commercial, Operations, Venture) são tratados como **application/workflow actors**, não como bounded contexts — ver [`../../architecture/domain-architecture.md`](../../architecture/domain-architecture.md).

## When to Revisit

- Um único provider se tornar claramente superior para todas as capabilities do produto, a ponto de a abstração deixar de agregar valor.
- A abstração escolhida se mostrar insuficiente para capabilities futuras (ex.: multimodalidade, function calling avançado).
