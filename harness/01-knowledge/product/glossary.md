# Glossário

Termos de domínio e produto usados nos documentos deste diretório. Mantido como fonte única — não redefinir estes termos em outros arquivos, apenas linkar de volta para cá.

| Termo | Definição |
| --- | --- |
| **Opportunity** | Unidade fundamental do produto: Creator + Brand + Context + Timing + Commercial Hypothesis. Ver [`vision.md`](vision.md#opportunity-como-entidade-central) e [`../domains/opportunity.md`](../domains/opportunity.md). |
| **Match** | Compatibilidade identificada entre um creator e uma marca (audience fit, content fit, etc.), sem necessariamente haver contexto ou timing para agir agora. Pré-requisito de uma Opportunity, mas não equivalente a ela. |
| **MatchReason** | Explicação estruturada de por que um Match existe (quais dimensões de fit o sustentam). |
| **Match Score** | Pontuação numérica de compatibilidade entre creator e marca. |
| **Opportunity Score** | Pontuação numérica de quão acionável/valiosa é uma Opportunity específica (Match + contexto + timing). |
| **CommercialHypothesis** | Hipótese de por que essa relação comercial específica deveria acontecer agora. |
| **SuggestedActivation** | Formato de ativação comercial sugerido para uma Opportunity (branded content, ambassador, event, licensing, travel, sponsorship etc.). |
| **TimingSignal** | Sinal que indica que este é o momento certo para uma Opportunity (ex.: lançamento de campanha, movimentação de marca). |
| **OpportunitySignal** | Sinal bruto de mercado que pode originar ou reforçar uma Opportunity (ex.: nova campanha, novo produto). |
| **Creator Graph** | Representação de dados de um creator: audiência, plataformas, nichos, narrativa, histórico comercial, pricing, estágio de carreira. Ver [`../domains/creator.md`](../domains/creator.md). |
| **Brand Graph** | Representação de dados de uma marca: categoria, produtos, campanhas, creators já utilizados, budget signals, decisores. Ver [`../domains/brand.md`](../domains/brand.md). |
| **Opportunity Graph** | Representação de matches e oportunidades identificadas entre Creator Graph e Brand Graph. |
| **Deal Graph** | Creator × Brand × Campaign × Offer × Price × Outcome — o dataset de aprendizado econômico real da plataforma; potencial moat. Ver [`../domains/deal.md`](../domains/deal.md). |
| **Wedge** | Conjunto mínimo de capabilities usado para entrar no mercado e provar a tese central: Brand Discovery + Creator Discovery + AI Matchmaking + Opportunity Intelligence. |
| **Flywheel** | Loop de reforço do produto: mais creators → mais inteligência → melhores matches → mais oportunidades → mais deals → mais dados → melhor matchmaking. Ver [`vision.md`](vision.md#north-star-e-flywheel). |
| **ICP** | Ideal Customer Profile — perfil de creator/marca que o produto deve priorizar inicialmente. Tratado como hipótese, não fato validado. Ver [`../business/icp.md`](../business/icp.md). |
| **Creator GMV** | Valor econômico gerado ou facilitado pela Oxente Creator entre marcas e creators. North Star de estágio maduro. |
| **North Star** | Métrica principal de sucesso do produto num dado estágio de maturidade. Ver [`metrics.md`](metrics.md). |
| **Cold-start problem** | Dificuldade de gerar valor em um marketplace de duas pontas antes de haver liquidez dos dois lados. Endereçado pela sequência Database → Intelligence Network → Marketplace. Ver [`strategy.md`](strategy.md#marketplace-strategy). |
| **Moat** | Vantagem competitiva defensável de longo prazo. Para a Oxente Creator, hipotetizado como o Deal Graph (dataset de outcomes comerciais reais), não a base de creators cadastrados. |
| **Creator Venture System** | Metodologia de business building já existente da Oxente Creator, com 5 dimensões: Position, Content, Monetization, Operations, Venture. Estrutura a expansão futura do produto (Layer 3). |
| **Layer 1 / 2 / 3** | Camadas conceituais do produto: 1 = Creator Intelligence, 2 = Commercial Intelligence, 3 = Creator Enterprise. Ver [`vision.md`](vision.md#product-layers). |
