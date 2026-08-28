# Opportunity Engine

> Estágio **NEXT** do [roadmap](../roadmap.md#next--opportunity-intelligence). Depende do Matchmaking (ver [`matchmaking.md`](matchmaking.md)) já estar operando.

## De search tool a Opportunity Engine

Depois do matchmaking, o produto evolui para descoberta proativa: o usuário não deveria precisar pesquisar continuamente. A plataforma observa o mercado e gera:

> "New opportunities for you."

## Estrutura de uma Opportunity gerada

```
Brand: X
Creator: Y

Opportunity Score: 94

Trigger:
  nova campanha / novo produto / movimentação da marca

Why this match:
  explicação contextual

Suggested activation:
  branded content / ambassador / event / licensing / travel / sponsorship etc.

Recommended approach:
  hipótese de abordagem comercial
```

## Componentes

- **Brand Monitoring** — observar movimentação de marcas (campanhas, lançamentos, sponsorships)
- **Campaign Signals** / **Market Signals** — sinais que disparam a geração de uma Opportunity (`OpportunitySignal`, `TimingSignal` — ver [`../glossary.md`](../glossary.md))
- **Opportunity Feed** — superfície onde as oportunidades geradas são entregues ao usuário
- **Opportunity Score** — ver [`matchmaking.md`](matchmaking.md#outputs)
- **Contact Discovery** — identificar decisores/contatos na marca
- **Suggested Pitch** — hipótese de abordagem comercial inicial

## Unknowns

- Fontes de sinal de mercado (quais, com que frequência, com que confiabilidade) — **TO RESEARCH**
- Frequência ideal de geração de oportunidades por creator (evitar fadiga de notificação) — **TO RESEARCH**
- Threshold de Opportunity Score para entrar no feed — **TO RESEARCH**
