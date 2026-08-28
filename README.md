# Oxente Creator

## Visão geral

> Oxente Creator is an AI-powered commercial intelligence and matchmaking platform for the Creator Economy.

A Oxente Creator é a inteligência comercial da Creator Economy. Descobrimos marcas, creators e oportunidades, identificamos quem deveria trabalhar junto e ajudamos esses matches a virarem negócio.

Visão completa, estratégia, domínios e decisões em [`harness/01-knowledge/`](harness/01-knowledge/) — começe por [`harness/01-knowledge/product/vision.md`](harness/01-knowledge/product/vision.md).

## Estrutura do repositório

- [`harness/`](harness/README.md) — tudo que um agente de IA precisa para trabalhar neste repositório (conhecimento de produto/arquitetura/negócio, especificações, execução e feedback). Ver [`harness/README.md`](harness/README.md) para os 4 blocos.
- `src/` — código da aplicação Next.js. Segue a estrutura conceitual definida em [`harness/01-knowledge/architecture/domain-architecture.md`](harness/01-knowledge/architecture/domain-architecture.md#arquitetura-de-pastas-conceitual):
  - `src/app/` — rotas (Next.js App Router).
  - `src/modules/{creators,brands,matching,opportunities}/` — módulos de domínio (bounded contexts), hoje vazios — código real entra feature a feature, com testes junto (`*.test.ts`).
  - `src/platform/{ai,supabase,jobs,integrations,observability}/` — integrações técnicas que os módulos consomem sem conhecer detalhe de implementação.
  - `src/shared/` — código compartilhado entre módulos.
  - `src/components/ui/`, `src/lib/` — gerados pelo shadcn/ui.
- `supabase/{migrations,functions}/` — migrations e Edge Functions do Supabase (ainda vazio).
- Arquitetura, stack e decisões (ADRs) que motivam essa estrutura: [`harness/01-knowledge/architecture/`](harness/01-knowledge/architecture/).

## Como rodar

Stack: Next.js + TypeScript + React + Tailwind CSS + shadcn/ui + Zod + Supabase SDK — ver [`harness/01-knowledge/architecture/stack.md`](harness/01-knowledge/architecture/stack.md).

**Pré-requisitos:** Node.js 20 LTS ou superior (desenvolvido/testado com Node 22 LTS) e npm.

```bash
npm install       # instala as dependências (gera/atualiza node_modules/)

npm run dev       # ambiente de desenvolvimento — http://localhost:3000

npm run build     # build de produção (também roda type-check)
npm run start     # serve o build de produção gerado por `npm run build`

npm run lint      # eslint
```

Nenhuma variável de ambiente é necessária ainda — a integração real com Supabase (`src/platform/supabase/`) ainda não foi implementada, apenas o SDK está instalado.
