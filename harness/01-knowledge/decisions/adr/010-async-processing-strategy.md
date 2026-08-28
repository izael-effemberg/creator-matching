# ADR-010 — Async Processing Strategy

## Status

Accepted

## Context

A Oxente Creator terá operações potencialmente longas — Brand Discovery, Creator Discovery, enrichment, crawling, AI processing, geração de embeddings, recalculação de matches, monitoramento de campanhas, Opportunity discovery. Vercel (ver [ADR-006](006-vercel-as-initial-web-host.md)) não é o ambiente adequado para processamento de longa duração dentro de HTTP requests.

## Decision

Separar conceitualmente **Synchronous Work** de **Asynchronous Work**:

- **Short-lived integration work** (webhooks, pequenas integrações, callbacks, pequenas chamadas de AI) → Supabase Edge Functions.
- **Long-running / heavy processing** (discovery, enrichment, crawling, embeddings, recálculo de matches, monitoramento) → Worker.

Workers **não precisam ser criados agora**. A arquitetura deve apenas prever a possibilidade futura de `Web Application + Worker` compartilhando a mesma codebase, os mesmos módulos de domínio, o mesmo PostgreSQL e os mesmos contratos (ver [ADR-004](004-modular-monolith.md)). Quando esse processamento assíncrono pesado surgir, a primeira opção de hosting recomendada para o worker é **Railway** (ver [ADR-006](006-vercel-as-initial-web-host.md#decision)).

Arquitetura futura possível (não implementada agora):

```
Vercel   → Web
Supabase → PostgreSQL, Auth, Storage
Railway  → Worker
```

## Rationale

- Rodar workloads pesados dentro de HTTP requests degrada latência e viola limites de execução de funções serverless.
- Edge Functions são adequadas para trabalho curto de integração, não para a fundação de workloads pesados.
- Compartilhar codebase e módulos de domínio entre web e worker evita duplicar lógica de domínio em dois lugares.

## Alternatives Considered

- **Rodar tudo dentro de requests HTTP na Vercel** — rejeitado: inviável para crawling/enrichment/AI processing de duração variável.
- **Criar o worker agora, antes de haver workload real** — rejeitado: nenhuma dessas operações está implementada ainda; criar infraestrutura de worker sem workload concreto é complexidade não justificada (ver princípio "every new infrastructure component must solve a demonstrated problem" em [`../../architecture/evolution.md`](../../architecture/evolution.md)).
- **Usar exclusivamente Supabase Edge Functions também para workloads pesados** — rejeitado: Edge Functions têm limites de duração inadequados para heavy processing.

## Consequences

### Positive

- Path de evolução claro para quando o primeiro workload pesado aparecer, sem exigir redesenho da arquitetura.
- Web e worker (quando existir) compartilham módulos de domínio, evitando duplicação de lógica.

### Negative

- Até que um worker exista, não há como processar workloads verdadeiramente longos — capabilities que dependam disso (ex.: crawling extenso) ficam bloqueadas até essa peça ser implementada.

## When to Revisit

- No momento em que uma capability concreta do roadmap (ex.: Brand Monitoring, estágio NEXT — ver [`../../product/roadmap.md`](../../product/roadmap.md#next--opportunity-intelligence)) exigir processamento que não caiba em uma Edge Function nem em um HTTP request da Vercel. Nesse ponto, criar o worker deixa de ser antecipação e passa a ser necessidade concreta.
