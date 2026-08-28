# Visão do produto

> Este documento explica **o quê** e **por quê**. Para **como vencer** (sequência, wedge, moat, não-metas), ver [`strategy.md`](strategy.md). Para modelagem detalhada de entidades, ver [`../domains/`](../domains/). Para o roadmap completo, ver [`roadmap.md`](roadmap.md).

## Posicionamento

> Oxente Creator is an AI-powered commercial intelligence and matchmaking platform for the Creator Economy.

"A Oxente Creator é a inteligência comercial da Creator Economy. Descobrimos marcas, creators e oportunidades, identificamos quem deveria trabalhar junto e ajudamos esses matches a virarem negócio."

**Tagline institucional:** "Turning Influence into Enterprise Value."

**Categoria de mercado (candidatas, não fechada):**
- Creator Commercial Intelligence
- AI Matchmaking for the Creator Economy
- Creator Relationship Intelligence

Evitamos posicionar o produto, *inicialmente*, como apenas: influencer marketing platform, influencer marketplace, creator CRM ou agência de influenciadores. Essas funcionalidades podem existir dentro do produto, mas nenhuma delas é a tese central — ver [ADR 003](../decisions/adr/003-positioning-as-commercial-intelligence.md).

## Problema

A Creator Economy tem hoje abundância de dois lados — creators buscando marcas, marcas buscando creators — e escassez de um terceiro elemento: a capacidade de identificar **quais relações entre eles têm maior probabilidade de gerar valor econômico real, e em que momento**.

Ferramentas existentes resolvem *descoberta* (diretórios, marketplaces, planilhas de agência) mas não resolvem *inteligência comercial*: por que esse creator e essa marca deveriam se encontrar agora, e não em qualquer outro momento.

## Tese central

> "Transformar influência em valor econômico."

O problema não é simplesmente descobrir creators. Também não é simplesmente descobrir marcas. **O problema central é identificar relações comerciais com maior probabilidade de gerar valor.**

A pergunta fundamental que o produto deve responder:

> "Quem deveria trabalhar com quem, por quê e por que agora?"

## Opportunity como entidade central

A unidade fundamental do produto não é o Creator, nem a Brand, nem o Match — é a **Opportunity**:

```
Opportunity = Creator + Brand + Context + Timing + Commercial Hypothesis
```

É importante não confundir **Match** com **Opportunity**:

- **Match** — creator e marca possuem compatibilidade (ex.: "Creator X tem forte aderência à Brand Y").
- **Opportunity** — existe contexto comercial suficiente para justificar ação agora (ex.: "Brand Y lançou uma campanha esta semana compatível com Creator X e existe uma hipótese concreta de ativação").

Todo Opportunity pressupõe um Match, mas nem todo Match vira uma Opportunity. Modelagem detalhada em [`../domains/opportunity.md`](../domains/opportunity.md).

## Product Graph

A visão de dados e inteligência do produto é composta por quatro graphs relacionados. Descrição de cada um e como se relacionam em [`../architecture/context-map.md`](../architecture/context-map.md); modelagem de entidades em [`../domains/`](../domains/).

| Graph | Representa | Domínio de detalhe |
| --- | --- | --- |
| **Creator Graph** | Creator, audiência, plataformas, nichos, narrativa, histórico comercial, pricing, estágio de carreira | [`domains/creator.md`](../domains/creator.md) |
| **Brand Graph** | Marca, categoria, produtos, campanhas, creators já utilizados, budget signals, decisores, agências | [`domains/brand.md`](../domains/brand.md) |
| **Opportunity Graph** | Match, contexto, timing, campaign signal, opportunity score, commercial hypothesis, suggested activation | [`domains/opportunity.md`](../domains/opportunity.md) |
| **Deal Graph** | Creator × Brand × Campaign × Offer × Price × Outcome — o aprendizado econômico real da plataforma | [`domains/deal.md`](../domains/deal.md) |

O **Deal Graph** é tratado como potencial *moat* da Oxente Creator: não a lista de creators, mas o dataset de "quem faz negócio com quem, em qual contexto, por qual preço e com qual resultado".

## Core product

Três capabilities fundamentais no primeiro estágio do produto. Detalhamento em [`intelligence/matchmaking.md`](intelligence/matchmaking.md) e [`intelligence/opportunity-engine.md`](intelligence/opportunity-engine.md).

1. **Brand Discovery** — "Quais marcas este creator deveria prospectar?" → output: Brand Intelligence Profile.
2. **Influencer Discovery** — "Quais creators são mais adequados para esta marca, campanha ou oportunidade?" → output: Creator Intelligence Profile.
3. **AI Matchmaking** — cruza Creator Graph e Brand Graph e identifica oportunidades, explicando *why them, why this, why now* (não apenas um score). Outputs: Match Score, Opportunity Score, Match Explanation, Suggested Activation, Suggested Commercial Angle.

Depois do matchmaking, o produto evolui para descoberta proativa — o **Opportunity Engine** — transformando o produto de uma search tool em um sistema que observa o mercado e entrega "new opportunities for you" sem que o usuário precise pesquisar continuamente.

## Product Layers

| Layer | Objetivo | Capabilities |
| --- | --- | --- |
| **1 — Creator Intelligence** | Understand the market | Brand Discovery, Creator Discovery, Brand Intelligence, Creator Intelligence, Market Intelligence, Campaign Intelligence |
| **2 — Commercial Intelligence** | Find and monetize opportunities | Matchmaking, Opportunity Engine, Commercial Signals, Contact Discovery, Outreach, Pricing, Proposal, CRM, Follow-up |
| **3 — Creator Enterprise** | Build durable businesses around influence | Positioning, Content, Monetization, Operations, Venture |

Layer 3 corresponde à metodologia já existente **Creator Venture System** (ver [`agents-overview.md`](agents-overview.md) para o mapeamento de agentes por camada). Ela não compete com o matchmaking como prioridade inicial — estrutura a expansão futura do produto.

## Roadmap

Sequência estratégica completa em [`roadmap.md`](roadmap.md): **NOW** (Match Intelligence) → **NEXT** (Opportunity Intelligence) → **THEN** (Commercial OS) → **LATER** (Creator Growth) → **FUTURE** (Creator Enterprise OS).

## North Star e flywheel

Métricas completas em [`metrics.md`](metrics.md). North Star evolui de *Qualified Opportunities Generated / Creator / Month* para *Creator GMV* (valor econômico gerado ou facilitado pela Oxente Creator entre marcas e creators) à medida que o produto amadurece.

Flywheel:

```
Mais creators
  → mais creator intelligence
    → melhores matches
      → mais oportunidades
        → mais propostas
          → mais campanhas
            → mais dados de pricing e outcome
              → melhor matchmaking
                → melhores oportunidades
                  → mais creators e marcas (loop fecha)
```

O moat potencial não é a lista de creators — é o dataset de outcomes comerciais reais (Deal Graph) que alimenta esse loop.

## Visão de longo prazo

A jornada completa do usuário, da descoberta ao business building:

```
DISCOVER → MATCH → SELL → GROW → OPERATE → BUILD
```

| Etapa da jornada | Capability do produto |
| --- | --- |
| Discover | Brand Discovery + Creator Discovery |
| Match | Matchmaking Engine + Opportunity Engine |
| Sell | Monetization / Commercial Agent |
| Grow | Positioning Agent + Content Agent |
| Operate | Operations Agent |
| Build | Venture Agent |

No limite, a Oxente Creator deixa de ser apenas uma ferramenta de descoberta e matchmaking e passa a ser o sistema operacional comercial de uma Creator Enterprise — da primeira oportunidade comercial até a construção de negócios próprios (produtos, marcas, participações) em torno da influência do creator.
