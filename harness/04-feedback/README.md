# Feedback

## O que vive aqui vs o que vive em src/tests

Este diretório guarda estratégia, config e resultados agregados; o código de teste em si continua junto do código-fonte.

## Quality scores

Placeholder para definição de métricas de qualidade (ex: cobertura de evals, taxa de acerto de matching).

## Demos

Cada use case concluído ganha um demo em `demos/<dominio>/<use-case>/`, copiado do template em `demos/_template/`.

- `script.md` — passo a passo reproduzível, feito para servir tanto de demonstração quanto de teste E2E de regressão quando possível
- `checklist.md` — espelha o `acceptance-criteria.md` do use case (`harness/02-intent/acceptance-criteria/<dominio>/<use-case>.md`), marcado item a item
- `evidence/` — último output real do demo rodado (log, screenshot, gif), versionado

Rastreabilidade esperada: `roadmap.md` → `spec.md` → código em `src/` → `acceptance-criteria.md` → `demos/<dominio>/<use-case>/`. Todo demo deve linkar de volta ao item do roadmap que ele comprova.

### Definition of Done de um demo

Um demo não é considerado concluído até que:
- [ ] `script.md` tem frontmatter completo (nenhum campo `<preencher>` restante) e as 4 seções preenchidas
- [ ] `checklist.md` tem todos os itens do `acceptance-criteria.md` correspondente espelhados e marcados
- [ ] `evidence/` tem pelo menos um arquivo seguindo a convenção de nome
- [ ] `status` no frontmatter está como `ready`, não `draft`
