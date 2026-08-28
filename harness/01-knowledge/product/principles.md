# Princípios do produto

## Trade-offs decididos

| Decisão | Escolhemos | Não escolhemos | Por quê |
| --- | --- | --- | --- |
| Unidade fundamental do produto | Opportunity (Creator + Brand + Context + Timing + Commercial Hypothesis) | Creator ou Brand isoladamente como unidade central | Compatibilidade sem contexto e timing não justifica ação comercial — ver [ADR 002](../decisions/adr/002-opportunity-as-core-entity.md) |
| Match vs. Opportunity | Dois conceitos distintos e sequenciais | Tratar compatibilidade e oportunidade como sinônimos | Match = compatibilidade; Opportunity = compatibilidade + contexto comercial suficiente para agir agora |
| Posicionamento inicial | Creator Commercial Intelligence / AI Matchmaking | Influencer marketing platform / marketplace / creator CRM / agência | Essas categorias já são disputadas e não capturam a tese central de geração de valor econômico — ver [ADR 003](../decisions/adr/003-positioning-as-commercial-intelligence.md) |
| Sequência de lançamento | Database → Intelligence Network → Marketplace | Marketplace como escopo do MVP | Reduz cold-start: o produto gera valor mesmo sem marcas e creators cadastrados |
| North Star | Métrica evolutiva (Opportunities → Conversões → Creator GMV) | "Número de creators cadastrados" | Vaidade métrica não mede valor econômico gerado |
| Escopo do Creator Venture System | Estrutura a expansão futura do produto | Construir as 5 dimensões (Position/Content/Monetization/Operations/Venture) desde o início | Foco no wedge — Brand Discovery + Creator Discovery + AI Matchmaking + Opportunity Intelligence — antes de expandir |
| Algoritmo de matchmaking | Documentar inputs/sinais/dimensões como hipótese, sem fechar o modelo | Especificar o algoritmo de matching prematuramente | Dimensões de fit ainda não foram validadas com dados reais — ver [`intelligence/matchmaking.md`](intelligence/matchmaking.md) |
