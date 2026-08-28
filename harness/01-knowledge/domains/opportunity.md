# Opportunity Domain

> Domínio central do produto — ver [`../product/vision.md`](../product/vision.md#opportunity-como-entidade-central) para a tese. Modelagem de domínio (conceitual), não schema de banco de dados.

## Match vs. Opportunity

Distinção fundamental, não intercambiável:

- **Match** — creator e marca possuem compatibilidade (ex.: "Creator X tem forte aderência à Brand Y").
- **Opportunity** — existe contexto comercial suficiente para justificar ação (ex.: "Brand Y lançou uma nova campanha esta semana compatível com Creator X e existe uma hipótese concreta de ativação").

Toda Opportunity pressupõe um Match. Nem todo Match vira uma Opportunity.

## Entidades

| Entidade | Descrição |
| --- | --- |
| **Match** | Compatibilidade identificada entre Creator e Brand |
| **MatchReason** | Explicação estruturada de por que o Match existe (quais dimensões de fit o sustentam) |
| **Opportunity** | Creator + Brand + Context + Timing + Commercial Hypothesis |
| **OpportunitySignal** | Sinal bruto de mercado que pode originar ou reforçar uma Opportunity |
| **TimingSignal** | Sinal que indica que este é o momento certo para agir |
| **OpportunityScore** | Pontuação de quão acionável/valiosa é a Opportunity |
| **CommercialHypothesis** | Hipótese de por que essa relação comercial deveria acontecer agora |
| **SuggestedActivation** | Formato de ativação comercial sugerido (branded content, ambassador, event, licensing, travel, sponsorship etc.) |

Definições de campo detalhadas (tipos, obrigatoriedade) ainda não existem — isso é trabalho de spec/schema, não de modelagem conceitual.

## Dimensões de Match (candidatas)

Ver [`../product/intelligence/matchmaking.md`](../product/intelligence/matchmaking.md) para a lista completa de dimensões candidatas (Audience Fit, Content Fit, Brand Affinity, etc.) e seu status de validação.

## Relações com outros domínios

- Consome dados de **Creator** ([`creator.md`](creator.md)) e **Brand** ([`brand.md`](brand.md)).
- Quando uma Opportunity avança (outreach → proposta → deal fechado), gera registro no **Deal Graph** ([`deal.md`](deal.md)), fechando o loop do flywheel.

## Capabilities associadas

AI Matchmaking, Opportunity Engine — ver [`../product/vision.md`](../product/vision.md#core-product) e [`../product/agents-overview.md`](../product/agents-overview.md#matchmaking-agent).
