# Domain Architecture

> Este documento trata da arquitetura de **software** em torno dos domínios (módulos, camadas, boundaries). Para a modelagem de negócio de cada domínio (atributos, entidades), ver [`../domains/`](../domains/) — não duplicado aqui.

## Bounded contexts iniciais

| Domínio | Responsabilidade | Modelagem de negócio |
| --- | --- | --- |
| **Creator** | Representação e entendimento de creators | [`../domains/creator.md`](../domains/creator.md) |
| **Brand** | Representação e inteligência sobre marcas | [`../domains/brand.md`](../domains/brand.md) |
| **Matching** | Avaliação de compatibilidade entre Brand e Creator | ver "Matching Architecture" abaixo |
| **Opportunity** | Identificação de oportunidades comerciais acionáveis | [`../domains/opportunity.md`](../domains/opportunity.md) |

Nota de consistência: o [`overview.md`](overview.md) trata "Matching" como parte do Opportunity Domain (suas entidades `Match`/`MatchReason` vivem em `domains/opportunity.md`). Nesta divisão de arquitetura de software, Matching aparece como bounded context próprio porque sua responsabilidade computacional (scoring, ranking) é distinta da responsabilidade de Opportunity (contexto, timing, hipótese comercial) — mesmo que hoje compartilhem o mesmo módulo de dados. Se essa separação computacional justificar um módulo de código próprio, decidir no momento da implementação; não antecipar aqui.

## Match vs. Opportunity (arquitetural)

Distinção já registrada formalmente em [`../domains/opportunity.md`](../domains/opportunity.md) e [ADR-002](../decisions/adr/002-opportunity-as-core-entity.md) — reafirmada aqui por ser central à arquitetura:

- **MATCH** representa compatibilidade (ex.: "Creator A possui forte aderência à Brand B").
- **OPPORTUNITY** representa compatibilidade + contexto comercial + timing + hipótese de ação (ex.: "Brand B lançou campanha relacionada ao território de Creator A e há uma ativação comercial plausível neste momento").

`Match does not necessarily mean Opportunity. Opportunity may reference a Match.`

## Evolução futura de domínio

Bounded contexts futuros — **não criar esses módulos de software nesta tarefa nem antes de o roadmap chegar no estágio correspondente** (ver [`../product/roadmap.md`](../product/roadmap.md)):

- Deals / Commercial
- Campaign
- Positioning
- Content
- Monetization
- Operations
- Venture

## Agent Architecture (princípio de domínio)

Os agentes conceituais (Brand Intelligence, Creator Intelligence, Matchmaking, Positioning, Content, Monetization/Commercial, Operations, Venture — ver [`../product/agents-overview.md`](../product/agents-overview.md)) são **application/workflow actors**, não bounded contexts. Um domínio (ex.: Brand) não deve depender da existência de um agente para funcionar — ver [ADR-008](../decisions/adr/008-ai-provider-abstraction.md#agent-architecture-princípio-relacionado).

## Data Architecture (princípio de domínio)

Dados descobertos ou inferidos por AI dentro de qualquer domínio seguem o princípio Evidence-first Intelligence — ver [ADR-009](../decisions/adr/009-evidence-first-intelligence.md) e [`data-architecture.md`](data-architecture.md).

## Matching Architecture

Não definir o Match Score como uma simples resposta gerada por LLM. Pipeline conceitual:

```
Creator Data + Brand Data + Signals
        ↓
 Feature Extraction
        ↓
 Scoring / Ranking
        ↓
      Match
        ↓
 LLM Explanation
```

O LLM pode extrair informação, normalizar, classificar, gerar explicações e identificar contexto — mas o score deve evoluir para um mecanismo controlável e observável, não uma caixa-preta. Primeira evolução possível (nenhuma implementada agora):

```
heuristics → weighted scoring → feedback-driven ranking → learning-to-rank / ML
```

Ver também [`../product/intelligence/matchmaking.md`](../product/intelligence/matchmaking.md) para as dimensões de fit candidatas (todas HYPOTHESIS).

## API Architecture

Mesmo utilizando Next.js, manter fronteiras explícitas entre camadas:

```
Interface → Application → Domain → Infrastructure
```

Fluxo conceitual de uma requisição:

```
HTTP → Validation (Zod) → Application Use Case → Domain → Repository / External Integrations
```

Não colocar lógica de domínio diretamente em componentes React, handlers HTTP, queries Supabase espalhadas pela aplicação, ou prompts de AI.

**Server Actions** podem ser usados quando apropriado, mas não devem se tornar a única interface da aplicação — capabilities importantes devem ter API explícita. Endpoints conceituais (não criados nesta tarefa):

```
/api/v1/creators
/api/v1/brands
/api/v1/matches
/api/v1/opportunities
```

## Arquitetura de pastas conceitual

Estrutura recomendada — **não criar estes diretórios nesta tarefa**, é uma recomendação para a etapa de implementação:

```
src/
  modules/
    creators/
    brands/
    matching/
    opportunities/

  platform/
    ai/
    supabase/
    jobs/
    integrations/
    observability/

  shared/

supabase/
  migrations/
  functions/
```

Cada módulo em `modules/` deve internamente refletir a separação Interface/Application/Domain/Infrastructure descrita acima. `platform/` concentra integrações técnicas (AI provider adapters, cliente Supabase, jobs, observabilidade) que os módulos de domínio consomem sem conhecer detalhes de implementação.
