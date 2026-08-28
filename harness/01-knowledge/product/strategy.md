# Estratégia de produto

> Este documento separa **visão** (o quê e por quê, ver [`vision.md`](vision.md)) de **estratégia** (onde jogar, como vencer, o que não faremos agora).

## Onde jogar

Creator Economy — no cruzamento entre inteligência de mercado (quem é quem) e inteligência comercial (quem deveria negociar com quem). Não competimos, inicialmente, no espaço de marketplace de execução de campanhas nem de agência full-service.

## Para quem

ICP inicial de creators e marcas — ver [`../business/icp.md`](../business/icp.md). Tratado como hipótese, não como segmento validado.

## Wedge

```
Brand Discovery + Creator Discovery + AI Matchmaking + Opportunity Intelligence
```

Este é o conjunto mínimo de capabilities que prova a tese central: conseguimos descobrir oportunidades comerciais relevantes que humanos dificilmente encontrariam de forma eficiente. Corresponde ao estágio **NOW** do [roadmap](roadmap.md).

## Por que agora

> A preencher. Nenhuma justificativa de timing de mercado foi fornecida ainda com evidência — registrar aqui apenas quando houver dado ou tese defensável, não suposição de mercado.

## Por que conseguimos vencer (moat)

O moat pretendido não é a base de creators ou marcas cadastradas — dados desse tipo são replicáveis. O moat é o **Deal Graph**: o dataset proprietário de "quem fez negócio com quem, em qual contexto, por qual preço e com qual resultado" (ver [`vision.md`](vision.md#product-graph)). Esse dataset só existe depois que a plataforma já gerou volume real de matches → oportunidades → propostas → deals, o que o torna difícil de replicar por um concorrente que só tem dados de descoberta.

## Sequência de capabilities (expansão de longo prazo)

```
Commercial → Growth → Operations → Venture
```

Mapeada sobre a jornada do **Creator Venture System** (Discover → Match → Sell → Grow → Operate → Build) — ver [`vision.md`](vision.md#visão-de-longo-prazo). O matchmaking (Match) é tratado como o componente central do sistema; as demais camadas (Sell, Grow, Operate, Build) são expansão futura, não escopo do MVP.

## Marketplace Strategy

Não assumimos que o MVP é um marketplace. Progressão pretendida:

```
DATABASE → INTELLIGENCE NETWORK → MARKETPLACE
```

A Oxente Creator deve conseguir gerar valor mesmo quando marcas e creators não possuem conta na plataforma (via Brand Discovery / Creator Discovery / Matchmaking rodando sobre dados enriquecidos externamente). Isso reduz o cold-start problem clássico de marketplaces de duas pontas — não precisamos de liquidez dos dois lados simultaneamente para entregar valor.

## O que deliberadamente NÃO faremos agora

- Não vamos nos posicionar como influencer marketplace, influencer marketing platform, creator CRM ou agência de influenciadores (ver [ADR 003](../decisions/adr/003-positioning-as-commercial-intelligence.md)).
- Não vamos assumir que o produto é um marketplace transacional desde o início (ver Marketplace Strategy acima).
- Não vamos construir as cinco dimensões do Creator Venture System (Position, Content, Monetization, Operations, Venture) como prioridade do MVP — elas estruturam expansão futura.
- Não vamos fechar o algoritmo de matchmaking prematuramente — ver [`intelligence/matchmaking.md`](intelligence/matchmaking.md) para o que é hipótese vs. o que está validado.
- Não vamos definir pricing definitivo do produto agora — ver [`../business/business-model.md`](../business/business-model.md).
- Não vamos tratar "número de creators cadastrados" como indicador de sucesso — ver [`metrics.md`](metrics.md).

## Escopo do MVP

O escopo funcional do estágio NOW está descrito em [`roadmap.md`](roadmap.md#now--match-intelligence). Requisitos e specs por use case ainda não existem neste repositório — serão decompostos em `harness/02-intent/` numa etapa posterior, fora do escopo deste documento.
