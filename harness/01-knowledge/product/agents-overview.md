# Agent Architecture (produto)

> **Não confundir com `harness/03-execution/agents/`.** Este documento descreve a arquitetura de agentes de IA que compõem o *produto* Oxente Creator (ex.: Matchmaking Agent). `harness/03-execution/` descreve os agentes de engenharia que operam *sobre este repositório* (coding agents). São conceitos diferentes que compartilham o nome "agent".
>
> Princípio de engenharia relacionado: nenhum destes agentes deve ser implementado acoplando um framework de agentes (LangChain, LangGraph, CrewAI etc.) como fundação arquitetural — ver [`../architecture/ai-architecture.md`](../architecture/ai-architecture.md#agent-architecture) e [ADR-008](../decisions/adr/008-ai-provider-abstraction.md).
>
> Este documento separa **product capability** (o que o produto faz, definido em [`vision.md`](vision.md) e [`intelligence/`](intelligence/)) de **agent implementation** (como uma capability é implementada como agente). Uma capability como Brand Discovery pode, no futuro, deixar de ser implementada como este agente específico sem que a capability em si mude.

## Mapeamento capability → agente

| Capability (produto) | Agente candidato |
| --- | --- |
| Brand Discovery | Brand Intelligence Agent |
| Creator Discovery | Creator Intelligence Agent |
| Matchmaking + Opportunity Engine | Matchmaking Agent |
| Positioning | Positioning Agent |
| Content | Content Agent |
| Monetization / Commercial | Monetization / Commercial Agent |
| Operations | Operations Agent |
| Venture | Venture Agent |

## Agentes

Para cada agente: `Goal`, `Inputs`, `Tools`, `Outputs`, `Guardrails`, `Human Approval`, `Memory / State`, `Events`, `Dependencies`. Apenas `Goal` está definido nesta etapa — as demais colunas são **TBD** e devem ser preenchidas quando cada agente for especificado (`harness/02-intent/`), não inventadas aqui.

### Brand Intelligence Agent
**Goal:** descobrir marcas; enriquecer dados; monitorar campanhas e sponsorships; identificar budget signals; encontrar decisores e commercial triggers.
Inputs / Tools / Outputs / Guardrails / Human Approval / Memory / Events / Dependencies: **TBD**

### Creator Intelligence Agent
**Goal:** descobrir creators; analisar conteúdo e posicionamento; estruturar Creator Profile; categorizar audiência; identificar histórico comercial.
Inputs / Tools / Outputs / Guardrails / Human Approval / Memory / Events / Dependencies: **TBD**

### Matchmaking Agent
**Goal:** gerar matches; explicar matches; calcular Match Score; calcular Opportunity Score; identificar commercial hypotheses. Considerado um dos componentes centrais do sistema.
Inputs / Tools / Outputs / Guardrails / Human Approval / Memory / Events / Dependencies: **TBD**

### Positioning Agent
**Goal:** pesquisa de mercado; benchmark; narrativa; posicionamento; ICP; category definition. Futuramente: "Positioning for Commercial Opportunity" — analisar como o posicionamento do creator aumenta ou reduz sua capacidade de fechar determinadas categorias de marcas.
Inputs / Tools / Outputs / Guardrails / Human Approval / Memory / Events / Dependencies: **TBD**

### Content Agent
**Goal:** content pillars; pautas; calendário; formatos; repurposing; trend analysis. Futuramente: "Content Planning for Brand Opportunity" (ex.: quais conteúdos um creator deveria produzir nos próximos 60 dias para aumentar relevância para determinadas categorias de marca).
Inputs / Tools / Outputs / Guardrails / Human Approval / Memory / Events / Dependencies: **TBD**

### Monetization / Commercial Agent
**Goal:** oportunidades; outreach; contact discovery; pricing; media kit; pitch; proposta; follow-up; pipeline; negotiation support. Fluxo: `MATCH → OPPORTUNITY → OUTREACH → PROPOSAL → DEAL`.
Inputs / Tools / Outputs / Guardrails / Human Approval / Memory / Events / Dependencies: **TBD**

### Operations Agent
**Goal:** CRM; contratos; briefing; entregáveis; aprovações; cobrança; pagamentos; analytics; renewal.
Inputs / Tools / Outputs / Guardrails / Human Approval / Memory / Events / Dependencies: **TBD**

### Venture Agent
**Goal:** identificar oportunidades de novos negócios; due diligence; business modeling; financial modeling; spin-off scoring; produtos próprios; equity opportunities.
Inputs / Tools / Outputs / Guardrails / Human Approval / Memory / Events / Dependencies: **TBD**

## Prioridade de implementação

Segue o [roadmap](roadmap.md): Brand Intelligence Agent, Creator Intelligence Agent e Matchmaking Agent pertencem ao estágio NOW/NEXT. Positioning, Content e Monetization/Commercial Agent pertencem a THEN/LATER. Operations e Venture Agent pertencem a FUTURE.
