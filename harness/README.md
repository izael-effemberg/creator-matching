# Harness

## O que é o harness

Explicar os 4 blocos e a ordem de leitura recomendada para um agente:

- `01-knowledge/` — o que o agente sabe
- `02-intent/` — o que ele deve fazer
- `03-execution/` — como ele faz
- `04-feedback/` — como se mede se fez certo

## Convenção de nomeação

Pastas numeradas (01-04) indicam a ordem do ciclo: o que o agente sabe → o que ele deve fazer → como ele faz → como se mede se fez certo.

> Nota: specs em `02-intent/` não ficam fisicamente coladas ao código de domínio — a referência de volta para o código é feita por link/ID dentro de cada spec, não por proximidade de pasta.
