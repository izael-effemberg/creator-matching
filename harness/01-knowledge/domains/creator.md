# Creator Domain

> Modelagem de domínio (conceitual), não schema de banco de dados nem arquitetura física. Ver [`../architecture/context-map.md`](../architecture/context-map.md) para como este domínio se relaciona com os demais.

## O que representa

O **Creator Graph**: um creator e tudo que descreve seu potencial comercial.

## Atributos candidatos

- Identidade do creator
- Audiência (tamanho, demografia, geografia)
- Plataformas (onde atua, formatos por plataforma)
- Localização
- Nichos
- Posicionamento
- Narrativa
- Interesses
- Categorias
- Conteúdo (amostras, temas)
- Temas recorrentes
- Estilo
- Histórico de campanhas
- Marcas relacionadas
- Performance
- Afinidade comercial (brand affinity)
- Pricing
- Estágio de carreira

Nenhum destes atributos possui, ainda, definição de tipo, fonte de dado ou forma de coleta/enriquecimento — isso é decisão de implementação, fora do escopo deste documento.

## Relações com outros domínios

- Participa de **Match** e **Opportunity** (ver [`opportunity.md`](opportunity.md)) em relação a uma ou mais **Brand** (ver [`brand.md`](brand.md)).
- Histórico de negócios fechados alimenta o **Deal Graph** (ver [`deal.md`](deal.md)), que por sua vez retroalimenta a qualidade do matching (flywheel — ver [`../product/vision.md`](../product/vision.md#north-star-e-flywheel)).

## Capabilities associadas

- Creator Discovery
- Creator Intelligence Profile (output)

Ver [`../product/vision.md`](../product/vision.md#core-product) e [`../product/agents-overview.md`](../product/agents-overview.md#creator-intelligence-agent).
