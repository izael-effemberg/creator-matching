# Matchmaking

> O algoritmo de matching não está definido. Este documento registra inputs, sinais, dimensões e outputs candidatos como hipóteses de produto, não como especificação técnica. Ver [`../assumptions.md`](../assumptions.md) para o status de validação de cada hipótese relacionada.

## O que o Matchmaking faz

É o coração do core product: cruza [Creator Graph e Brand Graph](../vision.md#product-graph) e identifica oportunidades. Não entrega apenas um score — explica:

- **Why them?**
- **Why this?**
- **Why now?**

## Inputs

- Creator Graph (ver [`../../domains/creator.md`](../../domains/creator.md))
- Brand Graph (ver [`../../domains/brand.md`](../../domains/brand.md))
- Sinais de mercado/campanha (Campaign Signal)

## Dimensões candidatas

| Dimensão | Status |
| --- | --- |
| Audience Fit | HYPOTHESIS |
| Content Fit | HYPOTHESIS |
| Brand Affinity | HYPOTHESIS |
| Cultural Fit | HYPOTHESIS |
| Campaign Fit | HYPOTHESIS |
| Commercial Fit | HYPOTHESIS |
| Timing | HYPOTHESIS |
| Brand Safety | HYPOTHESIS |
| Geographic Fit | HYPOTHESIS |
| Historical Compatibility | HYPOTHESIS |

Nenhuma dimensão foi validada com dados reais ainda. Como essas dimensões se combinam em um score (pesos, modelo, regras vs. ML) é **TO RESEARCH**.

## Outputs

- Match Score
- Opportunity Score
- Match Explanation
- Suggested Activation
- Suggested Commercial Angle

## Explainability

Requisito de produto, não opcional: todo match/opportunity deve vir acompanhado de uma explicação (`MatchReason`) legível por humano, não apenas um número. Como estruturar essa explicação de forma consistente entre dimensões é **TO RESEARCH**.

## Feedback loop

O Deal Graph (outcomes reais de negócios fechados) é a fonte de aprendizado pretendida para melhorar o matching ao longo do tempo — ver flywheel em [`../vision.md`](../vision.md#north-star-e-flywheel). Mecanismo concreto de feedback (retraining, ajuste de pesos, revisão humana) é **TO RESEARCH**.

## Unknowns

- Modelo de scoring (regras, ML, híbrido) — **TO RESEARCH**
- Como ponderar dimensões entre si — **TO RESEARCH**
- Como validar precisão do match sem dados históricos de deal — **TO RESEARCH**
- Diferença de matching por vertical/categoria de marca — **TO RESEARCH**
