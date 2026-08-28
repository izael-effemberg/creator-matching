# ADR-004 — Modular Monolith as the Initial Architecture

## Status

Accepted

## Context

A Oxente Creator está em estágio inicial: o domínio (Creator, Brand, Matching, Opportunity) ainda está sendo descoberto e vai mudar de forma significativa nos primeiros meses (ver [`../../product/roadmap.md`](../../product/roadmap.md)). A arquitetura inicial precisa otimizar para velocidade de desenvolvimento, velocidade de aprendizado, simplicidade operacional, baixo custo cognitivo, facilidade de deploy e facilidade de evolução — não para escala hipotética.

## Decision

Oxente Creator will initially be implemented as a **modular monolith**:

- uma única codebase;
- inicialmente um único deploy principal;
- um único banco PostgreSQL (ver [ADR-005](005-supabase-as-data-platform.md));
- módulos de negócio com fronteiras explícitas (ver [`../../architecture/domain-architecture.md`](../../architecture/domain-architecture.md));
- separação entre domínio, aplicação e infraestrutura dentro da mesma codebase;
- possibilidade futura de extrair workers ou serviços quando houver necessidade concreta (ver [`../../architecture/evolution.md`](../../architecture/evolution.md)).

Monolith does not mean unstructured code: `Simple Deployment + Explicit Domain Boundaries + Strong Architecture`.

## Rationale

- Faster delivery — sem overhead de coordenação entre serviços distribuídos.
- Domínio ainda evoluindo — fronteiras entre Creator/Brand/Matching/Opportunity provavelmente vão mudar; distribuir cedo demais é caro de desfazer.
- Baixa complexidade operacional — um único deploy, um único banco.
- Desenvolvimento local mais simples.
- Consistência transacional mais fácil de garantir dentro de um único banco.
- Observabilidade mais simples com um único processo/deploy principal.

## Alternatives Considered

- **Microservices desde o início** — rejeitado: distribui um domínio que ainda não está estável, aumenta custo operacional e cognitivo sem benefício demonstrado.
- **Serverless functions por capability** — rejeitado pelo mesmo motivo: fragmenta o domínio antes de ele estar bem entendido.
- **Big ball of mud (monolito sem fronteiras internas)** — rejeitado: não temos boundaries explícitos, o que inviabiliza a extração futura de serviços e degrada a manutenibilidade rapidamente.

## Consequences

### Positive

- Deploy e desenvolvimento simples desde o dia um.
- Domínio pode evoluir livremente sem custo de coordenação entre serviços.
- Caminho de evolução para workers/serviços fica aberto (ver [`../../architecture/evolution.md`](../../architecture/evolution.md)) sem exigir reescrita completa, desde que os boundaries internos sejam respeitados.

### Negative

- Risco de acoplamento entre módulos se as fronteiras não forem mantidas na prática.
- Um único deploy significa que, sem cuidado arquitetural, um problema em um módulo pode afetar a aplicação inteira.

**Mitigação:** fronteiras de domínio explícitas (ver [`../../architecture/domain-architecture.md`](../../architecture/domain-architecture.md)) e disciplina de camadas (Interface/Application/Domain/Infrastructure).

## When to Revisit

- Equipes independentes precisando deployar módulos separadamente.
- Workloads com perfis de recurso muito diferentes entre módulos (ex.: processamento pesado de AI vs. tráfego web).
- Necessidade real de scaling independente por módulo.
- Boundaries de domínio já estáveis o suficiente para justificar extração.
- Deployment independente trazendo benefício concreto e mensurável — não "achamos que vamos precisar escalar".
