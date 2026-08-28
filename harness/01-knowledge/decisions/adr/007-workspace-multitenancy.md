# ADR-007 — Workspace as the Multi-Tenancy Boundary

## Status

Accepted

## Context

Mesmo que a aplicação seja usada inicialmente apenas internamente pela Oxente Creator, o produto precisa estar preparado desde o início para múltiplos tipos de organização usando a plataforma (ver tipos futuros de workspace abaixo) — retrofitar multi-tenancy depois que dados e RLS já existem é significativamente mais caro do que modelar a fronteira desde o início.

## Decision

Modelo conceitual de autorização:

```
User → Membership → Workspace → Resources
```

**Workspace is the tenant boundary.** Recursos sensíveis deverão futuramente possuir relação explícita com workspace quando aplicável. Row Level Security (ver [ADR-005](005-supabase-as-data-platform.md)) deverá garantir isolamento no nível do banco.

Possíveis tipos futuros de workspace: Oxente internal, Creator, Agency, Brand.

Esta ADR registra o princípio estrutural, **não** implementa as entidades nem define as RLS policies — isso é FOLLOW-UP de implementação.

## Rationale

- Entidades como cidadãos de segunda classe adicionadas depois tendem a gerar migração de dados arriscada e RLS retroativo, mais propenso a erro do que RLS desenhado desde o início.
- O produto já antecipa múltiplos tipos de organização (creators, agências, marcas) na sua visão de longo prazo (ver [`../../product/vision.md`](../../product/vision.md#visão-de-longo-prazo)), então a fronteira de tenant é uma preocupação real, não hipotética.

## Alternatives Considered

- **Não modelar multi-tenancy agora, tratar tudo como um único tenant implícito** — rejeitado: adiar essa decisão até o primeiro cliente externo tende a exigir retrabalho estrutural em dados já existentes e RLS já escritas.
- **Modelar tenant no nível de User em vez de Workspace** — rejeitado: não suporta o caso de múltiplos usuários colaborando no mesmo workspace (ex.: equipe de uma agência, time interno da Oxente).

## Consequences

### Positive

- Dados sensíveis podem ser isolados por workspace desde a primeira modelagem de schema, evitando migração retroativa.
- Suporta naturalmente os tipos futuros de workspace sem redesenho.

### Negative

- Adiciona uma camada conceitual (Membership, Workspace) mesmo quando, no início, há efetivamente um único tenant em uso interno.
- RLS baseada em workspace exige disciplina desde as primeiras migrations — mal aplicada, é uma fonte sutil de vazamento de dados entre tenants.

## When to Revisit

Esta decisão não é sobre "se" — é uma fronteira estrutural adotada agora. Revisitar apenas se surgir evidência de que o modelo `User → Membership → Workspace → Resources` não é suficiente (ex.: necessidade de hierarquia de workspaces, ou de um recurso pertencer a múltiplos workspaces simultaneamente).
