---
mirrors: harness/02-intent/specs/creator/creator-intelligence-database.md §55 (Definition of Done — P0)
---

<!--
This file mirrors the SDD's P0 Definition of Done item-by-item. Each item is
marked with which implementation phase actually delivers it — see
harness/01-knowledge/decisions/adr/011-creator-ownership-model.md for why P0
itself was split into phases instead of built in one pass.
-->

# Acceptance Criteria — Creator Intelligence Database (P0)

## Phase 1 (implemented — see demos/creator/creator-intelligence-database-phase-1/ once recorded)

- [x] 1. Um Creator canônico puder ser criado.
- [x] 2. Múltiplas contas sociais puderem ser associadas ao mesmo Creator.
- [x] 3. O sistema impedir duplicações óbvias. *(unique slug; unique (platform, external_platform_id) where set — fuzzy/name-based dedup is explicitly out of scope, SDD §16)*
- [x] 4. Métricas puderem ser armazenadas como snapshots históricos.
- [x] 5. Growth puder ser derivado dos snapshots.
- [x] 6. Localizações e mercados puderem ser representados.
- [x] 7. Idiomas puderem ser representados.
- [x] 25. Data Source puder ser registrada. *(table exists; not yet wired into every write path — see Phase 2+)*
- [x] 26. Evidence puder ser ligada a uma entidade ou atributo. *(table exists; not yet populated by any use case)*
- [x] 28. Profile Completeness puder ser calculada. *(scoped to Phase 1 fields — see data-quality.service.ts)*
- [x] 29. Data Quality puder ser calculada. *(idem)*
- [x] 30. Matching Readiness puder ser determinado. *(caps at READY with Phase 1 data only, by design — SDD §21)*
- [x] 31. RLS impedir acesso cross-workspace indevido. *(verified against real local Supabase: member sees own workspace + global, not other workspaces; anon sees nothing; writes blocked for authenticated/anon)*
- [x] 32. Migrations estiverem versionadas. *(supabase/migrations/)*
- [x] 33. Generated TypeScript types estiverem atualizados. *(`npx supabase gen types typescript --local`, real generated types, not hand-authored)*
- [x] 34. Tests essenciais estiverem passando. *(26 unit + 1 integration test against real local Supabase, all green)*
- [x] 35. O Creator Intelligence Profile puder ser consultado pela aplicação. *(`/creators/[id]`, real page, real data, verified with curl)*
- [x] 36. O sistema souber diferenciar fato, observação, declaração, derivação e inferência. *(class distinction registered in `data_sources`/`evidence_items` provenance model; not yet exercised by every field)*
- [x] 37. O sistema consiga informar quando os principais dados foram observados. *(`observed_at` on every metric/location/language row)*
- [x] 38. Nenhum atributo sensível proibido seja inferido para matching. *(no such inference exists yet — trivially true; becomes a real constraint once Phase 3+ AI enrichment lands)*

## Later phases (not built in Phase 1 — same pattern, tables named in the spec)

- [ ] 8. Audience Snapshot — Phase 2
- [ ] 9. Distribuição geográfica de audiência — Phase 2
- [ ] 10. Age bands — Phase 2
- [ ] 11. Categories associadas ao creator — Phase 3
- [ ] 12. Topics associados ao creator — Phase 3
- [ ] 13. Content Pillars — Phase 3
- [ ] 14. Conteúdos individuais — Phase 3
- [ ] 15. Métricas históricas de conteúdo — Phase 3
- [ ] 16. Performance agregada de conteúdo — Phase 3
- [ ] 17. Observed Positioning — Phase 4
- [ ] 18. Desired Positioning — Phase 4
- [ ] 19. Brand Affinity — Phase 4
- [ ] 20. Brand Relationship — Phase 4
- [ ] 21. Commercial Profile — Phase 4
- [ ] 22. Opportunity Preferences — Phase 4
- [ ] 23. Commercial Constraints — Phase 4
- [ ] 24. Creator Contacts com visibilidade apropriada — Phase 4
- [ ] 27. AI Intelligence Assessment versionada — Phase 5 (`creator_intelligence_assessments`, no `vector` columns per ADR-011)

## Explicit non-goals reaffirmed for every phase (SDD §5)

Matchmaking Engine, Opportunity Engine, Deal CRM, contratos, pagamentos, billing, todos os agentes, scraping automatizado, algoritmo definitivo de Match Score, graph/vector database dedicado — nenhum destes é acceptance criteria desta feature em nenhuma fase.
