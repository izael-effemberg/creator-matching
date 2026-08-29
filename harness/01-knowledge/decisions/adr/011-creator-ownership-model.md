# ADR-011 — Creator Ownership Model, Workspace Prerequisite, Embeddings Deferral

## Status

Accepted

## Context

The Creator Intelligence Database SDD ([`../../../02-intent/specs/creator/creator-intelligence-database.md`](../../../02-intent/specs/creator/creator-intelligence-database.md)) explicitly flags "Global Creator vs Workspace-owned Creator model" as an open decision (§57) while simultaneously requiring RLS as an architectural requirement (§28) and multi-tenancy as a structural concern (§26) — but its own 39-table P0/P1 list contains no `workspaces` or `workspace_members` table, and its `vector`-typed columns (`creator_content_items.content_embedding`, `creator_intelligence_assessments.*_embedding`) appear in tables slated for P0 despite the SDD's own §53 caution against generating embeddings before semantic search is actually needed. Per the SDD's own instruction (§0.4) and this repo's convention (established across prior ADRs), these are registered as decisions rather than resolved silently.

## Decision

1. **Creator ownership: global-first.** `creators.workspace_id` is nullable. `NULL` = canonical, globally-discovered creator, broadly readable (RLS: any authenticated caller). A non-null value scopes the creator to that workspace's visibility. Claim/link mechanics (a workspace formally "managing" a globally-discovered creator without exclusive ownership) are explicitly out of scope — follow-up, not blocked by this schema.
2. **`workspaces` and `workspace_members` are added now**, ahead of the SDD's table list, as the minimal prerequisite ADR-007 needs to have any RLS to write. This is a partial delivery of ADR-007, not the full `User → Membership → Workspace` model (roles, invitations, workspace types are still follow-up).
3. **`vector` columns are deferred past P0.** `creator_content_items` and `creator_intelligence_assessments` are implemented (in their respective later phases) without embedding columns. They're added when semantic search is actually built, consistent with the SDD's own §53 and ADR-005/evolution.md's pgvector-when-needed principle.

## Rationale

- RLS without a tenant table to join against isn't RLS, it's a policy that can never evaluate true for anything workspace-scoped — the SDD's own §28 requirement can't be met without *some* workspace representation existing.
- Global-first matches the product's own Marketplace Strategy ([`../../product/strategy.md`](../../product/strategy.md#marketplace-strategy): Database → Intelligence Network → Marketplace) — Creator Discovery finds creators before any workspace has a commercial relationship with them; forcing workspace ownership at creation would mean inventing an owner for organically-discovered creators.
- Embeddings without a consuming semantic-search feature are pure storage cost and a schema commitment (pgvector extension, dimension choice, index type) made before there's a concrete requirement driving those choices — directly the kind of premature infrastructure ADR-005/evolution.md's fitness principles warn against.

## Alternatives Considered

- **Creator always workspace-owned** — rejected: requires deciding which workspace owns every organically-discovered creator (an "Oxente internal" workspace as universal owner was considered and rejected as a workaround that just re-implements "global" with extra indirection).
- **Add embedding columns now as nullable, unused** — rejected: still requires enabling `pgvector` and committing to a dimension/model before any consumer exists; nullable-and-unused doesn't reduce that commitment, it just hides it.
- **Wait for full ADR-007 User/Membership/role model before writing any RLS** — rejected: would block every table in this SDD indefinitely; the minimal `workspaces`/`workspace_members` pair is enough for correct RLS today without pretending the full model is done.

## Consequences

### Positive

- RLS is real and verified (see acceptance criteria), not a policy that vacuously passes.
- No schema rework needed when a real semantic search feature arrives — embeddings are additive columns/tables, not a redesign.
- Consistent with the product's global-discovery-first thesis instead of accidentally modeling Oxente as a walled-garden CRM.

### Negative

- `workspaces`/`workspace_members` exist without the surrounding product surface (invites, roles, workspace creation UI) — they're infrastructure ahead of feature, which is normally something this repo's principles caution against; justified here only because RLS has no other option.
- "Claiming" a globally-discovered creator into a workspace has no defined mechanism yet — a real gap if a workspace-management feature is requested before this is addressed.

## When to Revisit

- When a workspace-management feature (invites, roles, workspace types per ADR-007) is actually requested — extend `workspace_members`, don't redesign it.
- When a concrete semantic-search or similarity-matching capability is scoped — add `vector` columns and enable `pgvector` then, per ADR-005.
- If evidence emerges that global-first creates real data-governance problems (e.g., a workspace needing exclusive, non-shared ownership of a creator) — revisit the nullable `workspace_id` model itself.
