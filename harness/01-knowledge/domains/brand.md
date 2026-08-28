# Brand Domain

> Modelagem de domínio (conceitual), não schema de banco de dados nem arquitetura física. Ver [`../architecture/context-map.md`](../architecture/context-map.md) para como este domínio se relaciona com os demais.

## O que representa

O **Brand Graph**: uma marca e tudo que descreve sua propensão e capacidade de investir em relações comerciais com creators.

## Atributos candidatos

- Marca
- Empresa
- Categoria
- Produtos
- Público
- Posicionamento
- Geografias
- Campanhas
- Creators utilizados anteriormente
- Histórico de sponsorship
- Sinais de investimento em creator marketing
- Budget signals
- Contatos
- Agências
- Decisores
- Oportunidades

Nenhum destes atributos possui, ainda, definição de tipo, fonte de dado ou forma de coleta/enriquecimento — isso é decisão de implementação, fora do escopo deste documento. Em particular, "budget signals" é hipótese de que é possível estimar investimento de uma marca a partir de sinais indiretos — ver [`../product/assumptions.md`](../product/assumptions.md).

## Relações com outros domínios

- Participa de **Match** e **Opportunity** (ver [`opportunity.md`](opportunity.md)) em relação a um ou mais **Creator** (ver [`creator.md`](creator.md)).
- Histórico de negócios fechados alimenta o **Deal Graph** (ver [`deal.md`](deal.md)).

## Capabilities associadas

- Brand Discovery
- Brand Intelligence Profile (output)

Ver [`../product/vision.md`](../product/vision.md#core-product) e [`../product/agents-overview.md`](../product/agents-overview.md#brand-intelligence-agent).
