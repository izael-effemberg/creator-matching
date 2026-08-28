# Deal Domain

> Modelagem de domínio (conceitual), não schema de banco de dados. Ver [`../product/strategy.md`](../product/strategy.md#por-que-conseguimos-vencer-moat) para o racional de moat.

## O que representa

O **Deal Graph**: o aprendizado econômico real da plataforma.

```
Creator × Brand × Campaign × Offer × Price × Outcome
```

## Por que importa

Este dataset é tratado como potencial *moat* da Oxente Creator — não a lista de creators ou marcas cadastradas, mas o registro de quem efetivamente fez negócio com quem, em qual contexto, por qual preço e com qual resultado. É o dado que outros players não têm porque só existe depois de haver volume real de negociações fechadas na plataforma.

## Relação com o flywheel

Dados do Deal Graph retroalimentam a qualidade do Matchmaking (ver [`opportunity.md`](opportunity.md) e o flywheel em [`../product/vision.md`](../product/vision.md#north-star-e-flywheel)). Esse loop de feedback ainda não tem mecanismo definido — ver "Feedback loop" em [`../product/intelligence/matchmaking.md`](../product/intelligence/matchmaking.md).

## Relações com outros domínios

- Um registro de Deal se origina de uma **Opportunity** que avançou até negociação/fechamento (ver [`opportunity.md`](opportunity.md)).
- Referencia um **Creator** ([`creator.md`](creator.md)) e uma **Brand** ([`brand.md`](brand.md)).

## Capabilities associadas

Deal tracking, Pricing Intelligence — estágio **THEN** do [roadmap](../product/roadmap.md#then--commercial-os).
