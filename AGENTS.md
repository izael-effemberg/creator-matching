# AGENTS.md

## Como este repositório está organizado

> Todo o conhecimento, intenção, execução e feedback usados por agentes de IA vivem em [`harness/`](harness/README.md) (blocos `01-knowledge/`, `02-intent/`, `03-execution/`, `04-feedback/`). Código-fonte de domínio (`src/`) não faz parte do harness.

## Convenções para agentes de IA

## O que nunca fazer

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
