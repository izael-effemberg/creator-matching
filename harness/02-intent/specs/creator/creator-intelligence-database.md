<!--
Saved verbatim from the SDD provided by the user (chat), so it becomes a
versioned artifact under harness/02-intent/ instead of living only in chat
history — per harness/02-intent/README.md's own convention
(specs/<dominio>/<use-case>.md).

Implementation status: Phase 1 of P0 implemented — see
harness/02-intent/acceptance-criteria/creator/creator-intelligence-database.md
for what's done vs. later-phase, and
harness/01-knowledge/decisions/adr/011-creator-ownership-model.md for the
conflicts/open decisions this spec explicitly asked to be registered rather
than silently resolved.
-->

# OXENTE CREATOR

# Software Design Document — Creator Intelligence Database

**Version:** 1.0
**Status:** Proposed / Ready for Implementation
**Feature:** Creator Intelligence Database
**Product:** Oxente Creator
**Architecture:** Modular Monolith
**Application:** Next.js + TypeScript
**Data Platform:** Supabase / PostgreSQL
**Primary purpose:** Canonical, historical and explainable representation of creators for Creator Discovery, Matchmaking and Opportunity Intelligence.

---

# 0. IMPLEMENTATION CONTRACT

Este documento é a fonte de verdade funcional e técnica para a implementação da feature **Creator Intelligence Database** da Oxente Creator.

Antes de implementar:

1. Analise a estrutura atual do repositório.
2. Leia a documentação existente em `/docs`, especialmente Product Vision, Product Strategy, Architecture e ADRs.
3. Preserve as decisões arquiteturais existentes que não entrarem em conflito com este SDD.
4. Caso encontre conflito, não tome uma decisão silenciosamente. Registre o conflito antes de alterar a arquitetura.
5. Implemente respeitando a arquitetura de **Modular Monolith**.
6. Utilize **Supabase PostgreSQL** como banco principal.
7. Utilize **Supabase Auth e RLS** para autenticação/autorização quando aplicável.
8. Não introduza microservices, Redis, MongoDB, Neo4j, Elasticsearch ou outro banco sem necessidade explicitamente documentada.
9. Não implemente Matchmaking nesta feature. Apenas prepare o Creator Intelligence para ser consumido por Matching posteriormente.
10. Não transforme todos os atributos deste documento em requisitos obrigatórios do MVP.
11. Implemente P0 primeiro.
12. Preserve a possibilidade de evolução para P1 e P2 sem quebrar o domínio.

A implementação deve otimizar para:

**simplicidade operacional + excelente modelagem de domínio + evolução futura.**

---

# 1. EXECUTIVE SUMMARY

O **Creator Intelligence Database** é a fonte canônica de informações sobre creators dentro da Oxente Creator.

O objetivo não é construir simplesmente um cadastro de influenciadores.

A feature deve construir uma representação rica, histórica, explicável e comercialmente útil de cada creator.

O sistema precisa conseguir responder:

* Quem é esse creator?
* Em quais plataformas está presente?
* Qual o tamanho e comportamento de sua audiência?
* Onde está sua audiência?
* Sobre quais temas produz conteúdo?
* Quais são seus principais territórios editoriais?
* Como seu conteúdo performa?
* Como sua audiência está evoluindo?
* Qual é seu posicionamento atual?
* Qual é seu posicionamento desejado?
* Quais categorias comerciais possuem maior aderência?
* Com quais marcas já trabalhou?
* Com quais marcas possui afinidade?
* Quanto costuma cobrar?
* Quais formatos comerciais aceita?
* Quais restrições comerciais possui?
* Qual seu estágio de maturidade de negócio?
* Quais oportunidades comerciais poderiam fazer sentido?
* Qual é a origem de cada informação?
* Quando aquela informação foi observada?
* A informação é fato, dado declarado ou inferência?
* Qual a confiança da inferência?

O Creator Intelligence será uma das bases do sistema:

```text
Creator Intelligence
        +
Brand Intelligence
        +
Market / Campaign Signals
        ↓
Matching Engine
        ↓
Opportunity Engine
        ↓
Commercial Intelligence
```

---

# 2. PRODUCT CONTEXT

A Oxente Creator está sendo desenvolvida como uma plataforma de:

**AI-powered Commercial Intelligence and Matchmaking for the Creator Economy.**

A principal pergunta do produto é:

> Quem deveria trabalhar com quem, por quê e por que agora?

A unidade central futura da plataforma será a:

**Opportunity**

Conceitualmente:

```text
Creator
+
Brand
+
Context
+
Timing
+
Commercial Hypothesis
=
Opportunity
```

Para que uma Opportunity possa ser identificada corretamente, a plataforma precisa possuir uma representação profunda tanto de:

**Creator**

quanto de:

**Brand**

Este SDD cobre exclusivamente o lado:

# Creator Intelligence

---

# 3. FEATURE NAME

Nome externo / product-facing:

**Creator Intelligence**

Nome interno / engineering:

**Creator Intelligence Database**

Evitar tratar a feature apenas como:

`Creator CRUD`

ou:

`Influencer Database`

O banco é uma implementação.

O produto é uma camada de inteligência sobre creators.

---

# 4. GOALS

A feature deve:

* Criar uma identidade canônica de Creator independente das plataformas sociais.
* Permitir que um creator possua múltiplas contas em diferentes plataformas.
* Consolidar informações vindas de múltiplas fontes.
* Armazenar dados históricos, não apenas estado atual.
* Diferenciar fatos, dados observados, dados declarados e inferências.
* Armazenar provenance/evidence sempre que possível.
* Representar audiência.
* Representar conteúdo.
* Representar performance.
* Representar crescimento.
* Representar posicionamento.
* Representar relacionamento com marcas.
* Representar histórico comercial.
* Representar rates.
* Representar preferências comerciais.
* Representar restrições comerciais.
* Representar informações operacionais.
* Representar informações derivadas por AI.
* Produzir um Creator Intelligence Profile.
* Preparar dados para Creator Discovery.
* Preparar dados para Matchmaking.
* Preparar dados para Opportunity Intelligence.
* Permitir enriquecimento progressivo.
* Permitir versionamento.
* Permitir avaliação de freshness.
* Suportar multi-tenancy.
* Manter governança de dados sensíveis.
* Manter explainability.

---

# 5. NON-GOALS

Esta feature NÃO deve:

* implementar o Matchmaking Engine;
* implementar o Opportunity Engine;
* implementar Deal CRM completo;
* implementar contratos;
* implementar pagamentos;
* implementar billing;
* implementar todos os agentes da Oxente;
* implementar Venture Agent;
* implementar scraping específico de todas as redes sociais;
* definir o algoritmo definitivo de Match Score;
* criar graph database;
* criar vector database separado;
* armazenar seguidores individuais;
* inferir atributos pessoais sensíveis para matching;
* acoplar o domínio ao schema de Instagram/TikTok/YouTube;
* criar uma mega tabela `creators` com centenas de colunas;
* transformar LLM output em verdade sem provenance.

---

# 6. ARCHITECTURAL PRINCIPLES

## 6.1 Canonical Model First

Instagram, TikTok, YouTube, LinkedIn ou qualquer outro provider são fontes de dados.

Eles NÃO definem o domínio da Oxente.

A plataforma deve possuir seu próprio modelo canônico.

```text
Instagram ───┐
TikTok ──────┤
YouTube ─────┤
Manual ──────┤
Agency ──────┤
Third Party ─┘
      ↓
Normalization
      ↓
Creator Intelligence Model
```

---

## 6.2 One Creator, Multiple Accounts

Um creator pode possuir:

```text
Creator
 ├── Instagram Account
 ├── TikTok Account
 ├── YouTube Channel
 ├── LinkedIn Profile
 ├── Twitch Account
 ├── Newsletter
 └── Other Assets
```

A entidade `Creator` é independente de qualquer plataforma.

---

## 6.3 Historical Data First

Métricas mutáveis não devem ser sobrescritas.

Não fazer apenas:

```text
followers = 520000
```

Fazer:

```text
28/06 → 470000
28/07 → 495000
28/08 → 520000
```

Isso permite derivar:

* growth;
* velocity;
* acceleration;
* momentum;
* decay;
* anomaly;
* trends.

---

## 6.4 Evidence-first Intelligence

Sempre que possível:

```text
SOURCE
↓
EVIDENCE
↓
OBSERVATION
↓
SIGNAL
↓
FEATURE
↓
INTELLIGENCE
```

A plataforma deve poder explicar:

**Por que sabemos isso?**

---

## 6.5 Facts != Inferences

Todo dado deve poder ser classificado.

Classes principais:

| Class           | Meaning                              |
| --------------- | ------------------------------------ |
| `SYSTEM`        | gerado/controlado pela plataforma    |
| `OBSERVED`      | observado diretamente em uma fonte   |
| `SELF_DECLARED` | informado pelo creator/representante |
| `CURATED`       | revisado/definido manualmente        |
| `IMPORTED`      | importado diretamente de provider    |
| `DERIVED`       | calculado deterministicamente        |
| `AI_INFERRED`   | inferido por AI/modelo               |

---

# 7. DOMAIN MODEL

Modelo conceitual:

```text
Creator
│
├── Locations
├── Languages
├── Platform Accounts
│     ├── Account Metric Snapshots
│     └── Growth Metrics
│
├── Audience
│     ├── Audience Snapshots
│     ├── Geography
│     ├── Age Bands
│     ├── Distribution
│     └── Quality Assessments
│
├── Content
│     ├── Categories
│     ├── Topics
│     ├── Content Pillars
│     ├── Content Formats
│     ├── Content Items
│     ├── Content Metrics
│     └── Performance Aggregates
│
├── Positioning
│
├── Commercial Intelligence
│     ├── Commercial Profile
│     ├── Rates
│     ├── Brand Relationships
│     ├── Campaigns
│     ├── Commercial Effectiveness
│     ├── Opportunity Preferences
│     └── Commercial Constraints
│
├── Brand Affinity
│
├── Representation
├── Contacts
├── Brand Safety
├── Professional Assets
├── Owned Assets
├── Monetization Channels
├── Business Maturity
│
├── AI Intelligence
│
└── Sources & Evidence
```

---

# 8. COMPLETE DATA MODEL

## 8.1 `creators`

Entidade canônica do creator.

| Field                  | Type        | Required | Description                                    |
| ---------------------- | ----------- | -------: | ---------------------------------------------- |
| `id`                   | uuid        |        Y | Identificador interno imutável                 |
| `workspace_id`         | uuid        |       Y* | Tenant/workspace proprietário quando aplicável |
| `slug`                 | text        |        Y | Identificador legível                          |
| `display_name`         | text        |        Y | Nome público canônico                          |
| `stage_name`           | text        |        N | Nome artístico                                 |
| `legal_name`           | text        |        N | Nome legal, restricted                         |
| `headline`             | text        |        N | Definição profissional curta                   |
| `bio`                  | text        |        N | Bio canônica                                   |
| `profile_image_url`    | text        |        N | Imagem principal                               |
| `creator_type`         | enum        |        Y | individual, duo, group, company, virtual       |
| `creator_status`       | enum        |        Y | prospect, active, managed, inactive, archived  |
| `creator_tier`         | enum        |        N | nano, micro, mid, macro, mega, celebrity       |
| `is_verified_creator`  | boolean     |        Y | Identidade verificada pela Oxente              |
| `is_claimed`           | boolean     |        Y | Perfil reivindicado pelo creator               |
| `adult_status`         | enum        |        Y | adult, minor, unknown                          |
| `primary_market`       | text        |        N | Mercado comercial principal                    |
| `timezone`             | text        |        N | IANA timezone                                  |
| `first_seen_at`        | timestamptz |        Y | Primeira descoberta                            |
| `last_seen_at`         | timestamptz |        N | Última observação                              |
| `data_quality_score`   | numeric     |        N | Qualidade geral do perfil                      |
| `profile_completeness` | numeric     |        N | Completude                                     |
| `created_at`           | timestamptz |        Y | Criação                                        |
| `updated_at`           | timestamptz |        Y | Atualização                                    |
| `deleted_at`           | timestamptz |        N | Soft delete                                    |

---

# 8.2 `creator_locations`

Representa residência, origem e mercados comercialmente relevantes.

| Field                               | Type    | Required |
| ----------------------------------- | ------- | -------: |
| `id`                                | uuid    |        Y |
| `creator_id`                        | uuid    |        Y |
| `location_type`                     | enum    |        Y |
| `country_code`                      | char(2) |        N |
| `state_region`                      | text    |        N |
| `city`                              | text    |        N |
| `metro_area`                        | text    |        N |
| `relevance_score`                   | numeric |        N |
| `travel_available`                  | boolean |        N |
| `remote_campaign_available`         | boolean |        N |
| `international_campaigns_available` | boolean |        N |
| `valid_from`                        | date    |        N |
| `valid_to`                          | date    |        N |
| `source_confidence`                 | numeric |        N |

`location_type`:

```text
current_residence
origin
market_served
travel_market
frequent_market
```

---

# 8.3 `creator_languages`

| Field                 | Type    | Required |
| --------------------- | ------- | -------: |
| `id`                  | uuid    |        Y |
| `creator_id`          | uuid    |        Y |
| `language_code`       | text    |        Y |
| `proficiency`         | enum    |        N |
| `content_language`    | boolean |        Y |
| `commercial_language` | boolean |        Y |
| `content_share_pct`   | numeric |        N |
| `confidence`          | numeric |        N |

Proficiency:

```text
native
fluent
advanced
intermediate
basic
```

---

# 8.4 `creator_platform_accounts`

| Field                   | Type        | Required |
| ----------------------- | ----------- | -------: |
| `id`                    | uuid        |        Y |
| `creator_id`            | uuid        |        Y |
| `platform`              | enum        |        Y |
| `external_platform_id`  | text        |        N |
| `username`              | text        |        N |
| `display_name`          | text        |        N |
| `profile_url`           | text        |        Y |
| `bio`                   | text        |        N |
| `avatar_url`            | text        |        N |
| `website_url`           | text        |        N |
| `verified`              | boolean     |        N |
| `account_type`          | text        |        N |
| `account_status`        | enum        |        Y |
| `is_primary_account`    | boolean     |        Y |
| `is_creator_authorized` | boolean     |        Y |
| `access_scope`          | enum        |        Y |
| `last_synced_at`        | timestamptz |        N |
| `last_sync_status`      | enum        |        N |
| `raw_metadata`          | jsonb       |        N |
| `created_at`            | timestamptz |        Y |
| `updated_at`            | timestamptz |        Y |

Supported platform taxonomy should initially consider:

```text
instagram
tiktok
youtube
linkedin
twitch
x
facebook
pinterest
newsletter
podcast
website
other
```

---

# 8.5 `creator_account_metric_snapshots`

Nunca sobrescrever snapshots anteriores.

| Field             | Type        |
| ----------------- | ----------- |
| `id`              | uuid        |
| `account_id`      | uuid        |
| `observed_at`     | timestamptz |
| `followers_count` | bigint      |
| `following_count` | bigint      |
| `content_count`   | bigint      |
| `total_views`     | bigint      |
| `total_likes`     | bigint      |
| `total_comments`  | bigint      |
| `total_shares`    | bigint      |
| `total_saves`     | bigint      |
| `profile_views`   | bigint      |
| `reach`           | bigint      |
| `impressions`     | bigint      |
| `source_id`       | uuid        |
| `raw_metrics`     | jsonb       |
| `ingested_at`     | timestamptz |

---

# 8.6 `creator_growth_metrics`

Derived metrics.

| Field                        | Type        |
| ---------------------------- | ----------- |
| `id`                         | uuid        |
| `account_id`                 | uuid        |
| `window`                     | enum        |
| `window_start`               | timestamptz |
| `window_end`                 | timestamptz |
| `follower_growth_absolute`   | bigint      |
| `follower_growth_pct`        | numeric     |
| `avg_daily_follower_growth`  | numeric     |
| `growth_velocity`            | numeric     |
| `growth_acceleration`        | numeric     |
| `content_growth_correlation` | numeric     |
| `viral_growth_flag`          | boolean     |
| `audience_decay_flag`        | boolean     |
| `calculation_version`        | text        |
| `calculated_at`              | timestamptz |

Windows:

```text
7d
30d
90d
365d
custom
```

---

# 8.7 `creator_audience_snapshots`

| Field                          | Type          |
| ------------------------------ | ------------- |
| `id`                           | uuid          |
| `creator_id`                   | uuid          |
| `account_id`                   | uuid nullable |
| `observed_at`                  | timestamptz   |
| `followers`                    | bigint        |
| `estimated_reachable_audience` | bigint        |
| `estimated_active_audience`    | bigint        |
| `unique_viewers`               | bigint        |
| `returning_viewers`            | bigint        |
| `audience_data_scope`          | enum          |
| `source_id`                    | uuid          |
| `confidence`                   | numeric       |

`audience_data_scope`:

```text
public_estimate
authorized
third_party
manual
```

---

# 8.8 `creator_audience_geography`

| Field                  | Type    |
| ---------------------- | ------- |
| `id`                   | uuid    |
| `audience_snapshot_id` | uuid    |
| `geo_level`            | enum    |
| `country_code`         | char(2) |
| `region`               | text    |
| `city`                 | text    |
| `percentage`           | numeric |
| `absolute_estimate`    | bigint  |
| `rank`                 | integer |

`geo_level`:

```text
country
region
state
city
metro
```

---

# 8.9 `creator_audience_age_bands`

| Field                   | Type    |
| ----------------------- | ------- |
| `id`                    | uuid    |
| `audience_snapshot_id`  | uuid    |
| `age_band`              | enum    |
| `percentage`            | numeric |
| `absolute_estimate`     | bigint  |
| `source_dimension_name` | text    |

Age bands:

```text
13-17
18-24
25-34
35-44
45-54
55-64
65+
unknown
```

---

# 8.10 `creator_audience_distribution`

Estrutura genérica para dimensões agregadas fornecidas por fontes autorizadas.

| Field                    | Type    |
| ------------------------ | ------- |
| `id`                     | uuid    |
| `audience_snapshot_id`   | uuid    |
| `dimension`              | text    |
| `dimension_value`        | text    |
| `percentage`             | numeric |
| `absolute_estimate`      | bigint  |
| `is_sensitive_dimension` | boolean |
| `allowed_for_matching`   | boolean |

Qualquer dimensão potencialmente sensível deve possuir:

```text
allowed_for_matching = false
```

por padrão.

---

# 8.11 `creator_audience_quality_assessments`

Todo resultado desta tabela é uma avaliação, não um fato.

| Field                               | Type          |
| ----------------------------------- | ------------- |
| `id`                                | uuid          |
| `creator_id`                        | uuid          |
| `account_id`                        | uuid nullable |
| `assessed_at`                       | timestamptz   |
| `estimated_real_audience_pct`       | numeric       |
| `estimated_suspicious_audience_pct` | numeric       |
| `estimated_inactive_audience_pct`   | numeric       |
| `audience_quality_score`            | numeric       |
| `follower_authenticity_score`       | numeric       |
| `engagement_authenticity_score`     | numeric       |
| `suspicious_growth_score`           | numeric       |
| `comment_quality_score`             | numeric       |
| `audience_creator_overlap_score`    | numeric       |
| `audience_concentration_score`      | numeric       |
| `model_name`                        | text          |
| `model_version`                     | text          |
| `confidence`                        | numeric       |
| `evidence_set_id`                   | uuid          |

---

# 8.12 `creator_categories`

N:N entre creator e taxonomia de categoria.

| Field               | Type        |
| ------------------- | ----------- |
| `id`                | uuid        |
| `creator_id`        | uuid        |
| `category_id`       | uuid        |
| `relevance_score`   | numeric     |
| `is_primary`        | boolean     |
| `assignment_source` | enum        |
| `confidence`        | numeric     |
| `first_detected_at` | timestamptz |
| `last_detected_at`  | timestamptz |

`assignment_source`:

```text
self_declared
manual
AI
imported
```

---

# 8.13 `creator_topics`

Topics são mais granulares que categories.

| Field                        | Type        |
| ---------------------------- | ----------- |
| `id`                         | uuid        |
| `creator_id`                 | uuid        |
| `topic_id`                   | uuid        |
| `frequency`                  | numeric     |
| `relevance_score`            | numeric     |
| `trend_score`                | numeric     |
| `commercial_relevance_score` | numeric     |
| `first_detected_at`          | timestamptz |
| `last_detected_at`           | timestamptz |
| `confidence`                 | numeric     |

---

# 8.14 `creator_content_pillars`

| Field             | Type    |
| ----------------- | ------- |
| `id`              | uuid    |
| `creator_id`      | uuid    |
| `pillar_name`     | text    |
| `description`     | text    |
| `weight`          | numeric |
| `is_declared`     | boolean |
| `observed_weight` | numeric |
| `desired_weight`  | numeric |
| `confidence`      | numeric |
| `valid_from`      | date    |
| `valid_to`        | date    |

Importante distinguir:

```text
observed_weight
```

de:

```text
desired_weight
```

Isso permite comparar o conteúdo atual com a estratégia desejada.

---

# 8.15 `creator_content_formats`

| Field                          | Type        |
| ------------------------------ | ----------- |
| `id`                           | uuid        |
| `creator_id`                   | uuid        |
| `platform`                     | enum        |
| `format`                       | enum        |
| `usage_frequency`              | numeric     |
| `performance_score`            | numeric     |
| `commercial_performance_score` | numeric     |
| `preference_score`             | numeric     |
| `last_observed_at`             | timestamptz |

Formats:

```text
short_video
long_video
story
photo
carousel
live
podcast
newsletter
blog
event
speaking
ugc
other
```

---

# 8.16 `creator_content_items`

Cada conteúdo pode se tornar uma entidade.

| Field                   | Type            |
| ----------------------- | --------------- |
| `id`                    | uuid            |
| `creator_id`            | uuid            |
| `account_id`            | uuid            |
| `platform_content_id`   | text            |
| `content_type`          | enum            |
| `url`                   | text            |
| `title`                 | text            |
| `caption`               | text            |
| `transcript`            | text            |
| `published_at`          | timestamptz     |
| `duration_seconds`      | numeric         |
| `language_code`         | text            |
| `thumbnail_url`         | text            |
| `is_sponsored`          | boolean         |
| `sponsorship_disclosed` | boolean         |
| `detected_brand_ids`    | uuid[]          |
| `hashtags`              | text[]          |
| `mentions`              | text[]          |
| `content_embedding`     | vector nullable |
| `raw_data`              | jsonb           |
| `created_at`            | timestamptz     |

---

# 8.17 `creator_content_metric_snapshots`

| Field                        | Type        |
| ---------------------------- | ----------- |
| `id`                         | uuid        |
| `content_id`                 | uuid        |
| `observed_at`                | timestamptz |
| `views`                      | bigint      |
| `reach`                      | bigint      |
| `impressions`                | bigint      |
| `likes`                      | bigint      |
| `comments`                   | bigint      |
| `shares`                     | bigint      |
| `saves`                      | bigint      |
| `watch_time_seconds`         | numeric     |
| `average_watch_time_seconds` | numeric     |
| `completion_rate`            | numeric     |
| `clicks`                     | bigint      |
| `conversions`                | bigint      |
| `raw_metrics`                | jsonb       |

---

# 8.18 `creator_content_performance_aggregates`

| Field                          | Type          |
| ------------------------------ | ------------- |
| `id`                           | uuid          |
| `creator_id`                   | uuid          |
| `account_id`                   | uuid nullable |
| `window_type`                  | enum          |
| `window_start`                 | timestamptz   |
| `window_end`                   | timestamptz   |
| `avg_views`                    | numeric       |
| `median_views`                 | numeric       |
| `avg_reach`                    | numeric       |
| `median_reach`                 | numeric       |
| `avg_likes`                    | numeric       |
| `avg_comments`                 | numeric       |
| `avg_shares`                   | numeric       |
| `avg_saves`                    | numeric       |
| `avg_watch_time`               | numeric       |
| `avg_completion_rate`          | numeric       |
| `engagement_rate_by_followers` | numeric       |
| `engagement_rate_by_reach`     | numeric       |
| `engagement_rate_by_views`     | numeric       |
| `view_to_follower_ratio`       | numeric       |
| `share_rate`                   | numeric       |
| `save_rate`                    | numeric       |
| `comment_rate`                 | numeric       |
| `content_hit_rate`             | numeric       |
| `viral_post_rate`              | numeric       |
| `posting_frequency`            | numeric       |
| `days_since_last_post`         | numeric       |
| `content_consistency_score`    | numeric       |
| `calculation_version`          | text          |

Window types:

```text
last_10_posts
30d
90d
365d
custom
```

---

# 8.19 `creator_positioning_profiles`

Position deve suportar tanto percepção atual quanto objetivo estratégico.

| Field                        | Type        |
| ---------------------------- | ----------- |
| `id`                         | uuid        |
| `creator_id`                 | uuid        |
| `profile_type`               | enum        |
| `positioning_statement`      | text        |
| `creator_promise`            | text        |
| `value_proposition`          | text        |
| `primary_niche`              | text        |
| `secondary_niches`           | text[]      |
| `primary_category_id`        | uuid        |
| `desired_category_ids`       | uuid[]      |
| `audience_icp_description`   | text        |
| `creator_archetype`          | text        |
| `tone_of_voice`              | text[]      |
| `content_style`              | text[]      |
| `differentiators`            | text[]      |
| `expertise`                  | text[]      |
| `professional_credentials`   | jsonb       |
| `interests`                  | text[]      |
| `cultural_territories`       | text[]      |
| `commercial_territories`     | text[]      |
| `aspirational_brand_ids`     | uuid[]      |
| `positioning_maturity_score` | numeric     |
| `valid_from`                 | timestamptz |
| `valid_to`                   | timestamptz |
| `confidence`                 | numeric     |

`profile_type`:

```text
observed
desired
approved
```

---

# 8.20 `creator_brand_affinities`

Afinidade não significa relacionamento comercial.

| Field                       | Type        |
| --------------------------- | ----------- |
| `id`                        | uuid        |
| `creator_id`                | uuid        |
| `brand_id`                  | uuid        |
| `affinity_type`             | enum        |
| `affinity_score`            | numeric     |
| `organic_mentions_count`    | integer     |
| `positive_mentions_count`   | integer     |
| `recent_mentions_count`     | integer     |
| `last_mention_at`           | timestamptz |
| `existing_customer_signal`  | boolean     |
| `creator_declared_interest` | boolean     |
| `competitive_conflict`      | boolean     |
| `confidence`                | numeric     |
| `evidence_set_id`           | uuid        |

Affinity types:

```text
organic
historical
commercial
aspirational
audience
content
cultural
```

---

# 8.21 `creator_commercial_profiles`

| Field                          | Type        |
| ------------------------------ | ----------- |
| `id`                           | uuid        |
| `creator_id`                   | uuid        |
| `commercial_status`            | enum        |
| `open_for_campaigns`           | boolean     |
| `minimum_deal_value`           | numeric     |
| `preferred_currency`           | char(3)     |
| `negotiation_flexibility`      | enum        |
| `preferred_campaign_types`     | text[]      |
| `preferred_brand_category_ids` | uuid[]      |
| `excluded_brand_category_ids`  | uuid[]      |
| `desired_brand_category_ids`   | uuid[]      |
| `open_to_ambassadorship`       | boolean     |
| `open_to_affiliate`            | boolean     |
| `open_to_rev_share`            | boolean     |
| `open_to_licensing`            | boolean     |
| `open_to_events`               | boolean     |
| `open_to_travel`               | boolean     |
| `open_to_ugc`                  | boolean     |
| `open_to_equity`               | boolean     |
| `open_to_venture_building`     | boolean     |
| `commercial_maturity_score`    | numeric     |
| `commercial_notes`             | text        |
| `valid_from`                   | timestamptz |
| `valid_to`                     | timestamptz |

Commercial status:

```text
inactive
open
selective
represented
unavailable
```

Negotiation flexibility:

```text
fixed
flexible
package_only
case_by_case
```

---

# 8.22 `creator_rates`

| Field                | Type    |
| -------------------- | ------- |
| `id`                 | uuid    |
| `creator_id`         | uuid    |
| `deliverable_type`   | enum    |
| `platform`           | enum    |
| `quantity`           | integer |
| `price`              | numeric |
| `currency`           | char(3) |
| `minimum_price`      | numeric |
| `maximum_price`      | numeric |
| `negotiated_average` | numeric |
| `usage_rights_fee`   | numeric |
| `exclusivity_fee`    | numeric |
| `whitelisting_fee`   | numeric |
| `rush_fee`           | numeric |
| `travel_fee`         | numeric |
| `production_fee`     | numeric |
| `valid_from`         | date    |
| `valid_until`        | date    |
| `visibility`         | enum    |
| `source_id`          | uuid    |

Deliverable taxonomy inicial:

```text
instagram_reel
instagram_story
instagram_carousel
instagram_photo
tiktok_video
youtube_integration
youtube_dedicated
youtube_short
ugc_video
ugc_photo
live
event_appearance
event_hosting
speaking
brand_ambassador
content_licensing
whitelisting
paid_usage
photo_shoot
travel_experience
package
other
```

---

# 8.23 `creator_brand_relationships`

Resume a relação histórica Creator x Brand.

| Field                         | Type    |
| ----------------------------- | ------- |
| `id`                          | uuid    |
| `creator_id`                  | uuid    |
| `brand_id`                    | uuid    |
| `relationship_type`           | enum    |
| `relationship_status`         | enum    |
| `first_relationship_at`       | date    |
| `last_relationship_at`        | date    |
| `campaign_count`              | integer |
| `total_estimated_value`       | numeric |
| `currency`                    | char(3) |
| `is_current_ambassador`       | boolean |
| `exclusivity_active`          | boolean |
| `relationship_strength_score` | numeric |
| `confidence`                  | numeric |

Relationship types:

```text
organic
paid_campaign
ambassador
affiliate
event
gifting
licensing
venture
other
```

Status:

```text
historical
active
paused
ended
conflict
```

---

# 8.24 `creator_campaigns`

Histórico comercial detalhado.

| Field                 | Type          |
| --------------------- | ------------- |
| `id`                  | uuid          |
| `creator_id`          | uuid          |
| `brand_id`            | uuid nullable |
| `agency_name`         | text          |
| `campaign_name`       | text          |
| `campaign_type`       | text          |
| `campaign_objective`  | text          |
| `start_date`          | date          |
| `end_date`            | date          |
| `deliverables`        | jsonb         |
| `platforms`           | text[]        |
| `contract_value`      | numeric       |
| `currency`            | char(3)       |
| `creator_fee`         | numeric       |
| `production_cost`     | numeric       |
| `reach`               | bigint        |
| `views`               | bigint        |
| `engagements`         | bigint        |
| `clicks`              | bigint        |
| `conversions`         | bigint        |
| `sales_value`         | numeric       |
| `usage_rights`        | jsonb         |
| `usage_duration_days` | integer       |
| `territories`         | text[]        |
| `exclusivity`         | jsonb         |
| `payment_status`      | enum          |
| `renewal_status`      | enum          |
| `campaign_outcome`    | enum          |
| `source_id`           | uuid          |
| `confidence`          | numeric       |

---

# 8.25 `creator_commercial_effectiveness`

Derived commercial performance.

| Field                             | Type    |
| ---------------------------------- | ------- |
| `id`                              | uuid    |
| `creator_id`                      | uuid    |
| `window_start`                    | date    |
| `window_end`                      | date    |
| `average_deal_value`              | numeric |
| `median_deal_value`               | numeric |
| `total_creator_gmv`               | numeric |
| `gmv_last_12_months`              | numeric |
| `deal_frequency`                  | numeric |
| `repeat_brand_rate`               | numeric |
| `renewal_rate`                    | numeric |
| `proposal_to_deal_conversion`     | numeric |
| `conversation_to_deal_conversion` | numeric |
| `average_sales_cycle_days`        | numeric |
| `revenue_by_category`             | jsonb   |
| `revenue_by_platform`             | jsonb   |
| `revenue_by_content_type`         | jsonb   |
| `calculation_version`             | text    |

---

# 8.26 `creator_representations`

Restricted data.

| Field                      | Type    |
| -------------------------- | ------- |
| `id`                       | uuid    |
| `creator_id`               | uuid    |
| `representation_type`      | enum    |
| `agency_name`              | text    |
| `manager_name`             | text    |
| `business_email`           | text    |
| `manager_email`            | text    |
| `manager_phone`            | text    |
| `representation_start`     | date    |
| `representation_end`       | date    |
| `commission_pct`           | numeric |
| `exclusive_representation` | boolean |
| `verified`                 | boolean |
| `visibility`               | enum    |

Representation types:

```text
agency
manager
exclusive_agent
non_exclusive_agent
self_managed
```

---

# 8.27 `creator_contacts`

| Field              | Type        |
| ------------------ | ----------- |
| `id`               | uuid        |
| `creator_id`       | uuid        |
| `contact_type`     | enum        |
| `value`            | text        |
| `is_public`        | boolean     |
| `verified`         | boolean     |
| `source_id`        | uuid        |
| `last_verified_at` | timestamptz |
| `valid_from`       | timestamptz |
| `valid_to`         | timestamptz |

Contact types:

```text
public_email
commercial_email
management_email
agency_email
website
booking_url
phone
whatsapp
other
```

---

# 8.28 `creator_brand_safety_assessments`

Avalia conteúdo e risco comercial.

Não deve inferir identidade sensível.

| Field                                | Type        |
| ------------------------------------ | ----------- |
| `id`                                 | uuid        |
| `creator_id`                         | uuid        |
| `assessed_at`                        | timestamptz |
| `overall_brand_safety_score`         | numeric     |
| `content_moderation_score`           | numeric     |
| `adult_content_presence`             | numeric     |
| `violence_content_presence`          | numeric     |
| `hate_content_presence`              | numeric     |
| `regulated_product_presence`         | numeric     |
| `profanity_frequency`                | numeric     |
| `controversy_event_count`            | integer     |
| `copyright_risk`                     | numeric     |
| `misinformation_risk`                | numeric     |
| `sponsored_content_disclosure_score` | numeric     |
| `brand_conflict_risk`                | numeric     |
| `model_name`                         | text        |
| `model_version`                      | text        |
| `confidence`                         | numeric     |
| `evidence_set_id`                    | uuid        |

---

# 8.29 `creator_professional_assets`

Representa capacidades profissionais além de audiência.

| Field                    | Type    |
| ------------------------ | ------- |
| `id`                     | uuid    |
| `creator_id`             | uuid    |
| `skill_type`             | text    |
| `skill_name`             | text    |
| `level`                  | enum    |
| `years_experience`       | numeric |
| `evidence`               | jsonb   |
| `verified`               | boolean |
| `commercially_available` | boolean |

Skill taxonomy inicial:

```text
acting
music
presenting
public_speaking
writing
journalism
teaching
sports
modeling
photography
design
entrepreneurship
subject_matter_expertise
other
```

---

# 8.30 `creator_owned_assets`

Representa ativos de distribuição fora das principais redes sociais.

| Field                    | Type        |
| ------------------------ | ----------- |
| `id`                     | uuid        |
| `creator_id`             | uuid        |
| `asset_type`             | enum        |
| `asset_name`             | text        |
| `audience_size`          | bigint      |
| `monthly_active_size`    | bigint      |
| `monthly_visitors`       | bigint      |
| `commercial_value_score` | numeric     |
| `source_id`              | uuid        |
| `observed_at`            | timestamptz |

Assets:

```text
newsletter
podcast
website
community
app
customer_database
event
course
owned_product
offline_reach
other
```

---

# 8.31 `creator_monetization_channels`

| Field                     | Type        |
| ------------------------- | ----------- |
| `id`                      | uuid        |
| `creator_id`              | uuid        |
| `channel`                 | enum        |
| `active`                  | boolean     |
| `estimated_revenue_share` | numeric     |
| `maturity_score`          | numeric     |
| `potential_score`         | numeric     |
| `last_assessed_at`        | timestamptz |

Channels:

```text
brand_deals
ad_revenue
affiliate
subscriptions
courses
consulting
speaking
events
merchandise
owned_products
licensing
royalties
community
venture
equity
other
```

---

# 8.32 `creator_business_maturity_profiles`

Baseado no Creator Venture System.

| Field                             | Type        |
| ---------------------------------- | ----------- |
| `id`                              | uuid        |
| `creator_id`                      | uuid        |
| `assessed_at`                     | timestamptz |
| `positioning_maturity`            | numeric     |
| `content_maturity`                | numeric     |
| `commercial_maturity`             | numeric     |
| `operations_maturity`             | numeric     |
| `monetization_maturity`           | numeric     |
| `venture_readiness`               | numeric     |
| `overall_business_maturity_score` | numeric     |
| `method_version`                  | text        |
| `notes`                           | text        |

---

# 8.33 `creator_opportunity_preferences`

Essencial para qualificação futura de Opportunities.

| Field                      | Type        |
| -------------------------- | ----------- |
| `id`                       | uuid        |
| `creator_id`               | uuid        |
| `wanted_category_ids`      | uuid[]      |
| `unwanted_category_ids`    | uuid[]      |
| `wanted_brand_ids`         | uuid[]      |
| `blocked_brand_ids`        | uuid[]      |
| `minimum_budget`           | numeric     |
| `currency`                 | char(3)     |
| `preferred_deal_types`     | text[]      |
| `preferred_platforms`      | text[]      |
| `preferred_markets`        | jsonb       |
| `travel_preferences`       | jsonb       |
| `availability`             | jsonb       |
| `campaign_frequency_limit` | numeric     |
| `competitor_restrictions`  | jsonb       |
| `current_exclusivities`    | jsonb       |
| `valid_from`               | timestamptz |
| `valid_to`                 | timestamptz |

---

# 8.34 `creator_commercial_constraints`

Self-declared commercial policy.

Nunca inferir crenças pessoais através destes atributos.

| Field                | Type        |
| -------------------- | ----------- |
| `id`                 | uuid        |
| `creator_id`         | uuid        |
| `category_or_policy` | text        |
| `policy`             | enum        |
| `notes`              | text        |
| `valid_from`         | timestamptz |
| `valid_to`           | timestamptz |
| `source_id`          | uuid        |

Policy:

```text
allowed
disallowed
case_by_case
unknown
```

---

# 8.35 `creator_intelligence_assessments`

Representação analítica/AI versionada.

| Field                             | Type            |
| --------------------------------- | --------------- |
| `id`                              | uuid            |
| `creator_id`                      | uuid            |
| `assessment_type`                 | enum            |
| `creator_summary`                 | text            |
| `commercial_summary`              | text            |
| `creator_embedding`               | vector nullable |
| `content_embedding`               | vector nullable |
| `commercial_embedding`            | vector nullable |
| `audience_embedding`              | vector nullable |
| `content_quality_score`           | numeric         |
| `content_consistency_score`       | numeric         |
| `creator_authority_score`         | numeric         |
| `creator_relevance_score`         | numeric         |
| `commercial_readiness_score`      | numeric         |
| `brand_attractiveness_score`      | numeric         |
| `growth_score`                    | numeric         |
| `audience_quality_score`          | numeric         |
| `creator_momentum_score`          | numeric         |
| `creator_uniqueness_score`        | numeric         |
| `brand_partnership_propensity`    | numeric         |
| `estimated_marketability`         | numeric         |
| `recommended_brand_category_ids`  | uuid[]          |
| `recommended_campaign_types`      | text[]          |
| `recommended_positioning_actions` | jsonb           |
| `model_name`                      | text            |
| `model_version`                   | text            |
| `prompt_version`                  | text            |
| `input_fingerprint`               | text            |
| `generated_at`                    | timestamptz     |
| `confidence`                      | numeric         |
| `evidence_set_id`                 | uuid            |

Assessment types:

```text
general
content
commercial
audience
positioning
matching_readiness
```

Nenhuma assessment deve ser tratada como verdade permanente.

Toda assessment deve ser versionável e recalculável.

---

# 8.36 `data_sources`

Registry central de provenance.

| Field                  | Type        |
| ---------------------- | ----------- |
| `id`                   | uuid        |
| `source_type`          | enum        |
| `provider`             | text        |
| `source_url`           | text        |
| `external_id`          | text        |
| `access_scope`         | enum        |
| `terms_context`        | text        |
| `retrieved_at`         | timestamptz |
| `observed_at`          | timestamptz |
| `raw_payload_hash`     | text        |
| `raw_payload_location` | text        |
| `confidence`           | numeric     |
| `created_at`           | timestamptz |

Source types:

```text
platform_api
public_web
creator_provided
agency_provided
manual
internal
AI_inference
third_party
```

Access scopes:

```text
public
authorized
licensed
restricted
internal
```

---

# 8.37 `evidence_items`

| Field           | Type          |
| --------------- | ------------- |
| `id`            | uuid          |
| `source_id`     | uuid          |
| `entity_type`   | text          |
| `entity_id`     | uuid          |
| `field_name`    | text nullable |
| `evidence_type` | enum          |
| `raw_value`     | jsonb         |
| `evidence_text` | text          |
| `observed_at`   | timestamptz   |
| `confidence`    | numeric       |
| `expires_at`    | timestamptz   |
| `created_at`    | timestamptz   |

Evidence types:

```text
raw_value
quote
metric
content_reference
manual_attestation
model_input
```

---

# 8.38 `taxonomy_categories`

# 8.39 `taxonomy_topics`

Categorias e topics devem utilizar vocabulário controlado.

Estrutura:

| Field           | Type          |
| --------------- | ------------- |
| `id`            | uuid          |
| `taxonomy_type` | enum          |
| `name`          | text          |
| `slug`          | text          |
| `parent_id`     | uuid nullable |
| `description`   | text          |
| `aliases`       | text[]        |
| `is_active`     | boolean       |
| `version`       | text          |

---

# 9. INITIAL CREATOR CATEGORY TAXONOMY

Taxonomia inicial sugerida:

```text
Beauty
Fashion
Lifestyle
Travel
Food
Fitness
Sports
Health
Wellness
Technology
Business
Finance
Education
Gaming
Entertainment
Comedy
Music
Culture
Art
Cinema
TV
Books
Parenting
Family
Automotive
Home
Architecture
Design
Luxury
Hospitality
Tourism
Career
Entrepreneurship
Creator Economy
Photography
Relationships
Pets
Sustainability
Other
```

Deve ser possível criar:

```text
Parent Category
    ↓
Subcategory
```

Exemplo:

```text
Technology
├── AI
├── Software
├── Consumer Electronics
├── Programming
└── Startups
```

---

# 10. CREATOR TIER TAXONOMY

Thresholds devem ser configuráveis.

Não hardcode permanentemente no domínio.

Baseline inicial:

```text
Nano
Micro
Mid
Macro
Mega
Celebrity
```

O tier deve ser derivado por plataforma ou audience aggregate.

Nunca utilizar tier como principal medida de qualidade.

---

# 11. DATA TEMPORALITY

Cada atributo deve ser classificado conforme frequência esperada de mudança.

## Stable

Exemplos:

```text
stage_name
languages
professional background
```

Atualização eventual.

## Slow-changing

```text
positioning
commercial preferences
representation
```

Atualização em semanas/meses.

## Medium

```text
bio
categories
topics
content pillars
```

Atualização semanal/mensal.

## Fast

```text
followers
engagement
views
growth
```

Atualização diária/semanal.

## Event-driven

```text
campaign
brand relationship
controversy signal
new representation
new exclusivity
```

Atualização quando detectada.

---

# 12. FRESHNESS MODEL

Dados relevantes devem possuir, direta ou indiretamente:

```text
observed_at
retrieved_at
last_verified_at
valid_from
valid_to
expires_at
```

O produto deve posteriormente conseguir classificar:

```text
FRESH
AGING
STALE
UNKNOWN
```

Não fazer refresh de todos os dados com a mesma frequência.

---

# 13. CREATOR INGESTION SOURCES

A arquitetura deve aceitar múltiplas origens.

```text
Manual Entry
Public Profile
Platform API
Creator-authorized API
Agency Data
CSV Import
Third-party Provider
Internal Operations
AI Enrichment
```

---

# 14. CREATOR INGESTION FLOW

Fluxo conceitual:

```text
INPUT
↓
Source registration
↓
Creator candidate
↓
Identity resolution
↓
Duplicate detection
↓
Canonical Creator
↓
Platform accounts
↓
Raw observations
↓
Normalization
↓
Metrics
↓
Content
↓
Audience
↓
Topics / Categories
↓
Positioning
↓
Commercial intelligence
↓
AI enrichment
↓
Quality validation
↓
Matching Readiness
```

---

# 15. CREATOR ONBOARDING METHODS

A implementação deve permitir evolução para pelo menos:

## Method A — Manual

Operador informa:

```text
Name
Instagram URL
TikTok URL
YouTube URL
etc.
```

## Method B — URL Discovery

Usuário informa:

```text
https://instagram.com/creator
```

Sistema tenta resolver identidade.

## Method C — CSV Import

Importar múltiplos creators.

## Method D — Automated Discovery

Feature futura:

Creator Intelligence Agent identifica creators automaticamente.

---

# 16. IDENTITY RESOLUTION

Antes de criar novo creator, executar deduplication.

Possíveis sinais:

```text
same external platform id
same username + platform
same profile URL
same canonical website
cross-linked social profiles
same commercial email
manual confirmation
high-confidence AI entity resolution
```

Nunca unir dois creators apenas porque possuem nomes semelhantes.

Quando houver ambiguidade:

```text
POSSIBLE_DUPLICATE
```

deve ser preferível a merge automático.

---

# 17. RAW DATA POLICY

Provider-specific payload pode ser armazenado em:

```text
raw_metadata
raw_metrics
raw_data
```

Mas dados importantes para produto devem ser normalizados.

Não fazer:

```text
todo o sistema consulta raw JSON do Instagram
```

Fazer:

```text
Provider Data
↓
Normalization
↓
Canonical Fields
```

---

# 18. AI ENRICHMENT

AI pode ser utilizada para:

```text
content classification
topic extraction
category classification
positioning analysis
tone analysis
content style analysis
brand detection
commercial territory detection
creator summary
commercial summary
brand affinity
content quality
brand safety
marketability
commercial readiness
```

AI não deve:

```text
criar dados factuais inexistentes
substituir provenance
produzir Match Score final nesta feature
inferir atributos pessoais sensíveis
```

---

# 19. AI OUTPUT CONTRACT

Todo output AI persistido deve possuir:

```text
model_name
model_version
prompt_version
generated_at
confidence
input_fingerprint
evidence_set_id
```

Isso é necessário para permitir:

```text
recalculation
comparison
auditing
evaluation
model migration
```

---

# 20. SENSITIVE ATTRIBUTE GOVERNANCE

A plataforma NÃO deve inferir automaticamente para fins de matching:

```text
race
ethnicity
religion
sexual_orientation
medical_condition
political_affiliation
trade_union_membership
precise sensitive personal attributes
```

Brand Safety deve avaliar:

**conteúdo e risco comercial**

e não características pessoais do creator.

---

# 21. MATCHING READINESS

O Creator Intelligence precisa produzir um estado:

```text
NOT_READY
PARTIALLY_READY
READY
HIGH_CONFIDENCE
```

A readiness não significa que todos os campos estejam preenchidos.

Significa que existe informação suficiente para Matching.

---

# 22. P0 MATCHING FEATURES

Para primeira versão do Matchmaking, priorizar:

```text
Identity
Platform accounts
Follower counts
Audience scale
Creator location
Audience geography
Languages
Categories
Topics
Content pillars
Content formats
Content performance
Growth
Positioning
Commercial availability
Brand relationships
Brand affinities
Commercial preferences
Commercial constraints
Data freshness
Source confidence
```

---

# 23. CREATOR INTELLIGENCE PROFILE

A principal representação de produto deve consolidar diferentes tabelas em uma visão consumível.

Exemplo conceitual:

```text
CREATOR INTELLIGENCE PROFILE

Identity
━━━━━━━━━━━━━━━━━━━━━
Name
Headline
Location
Languages

Reach
━━━━━━━━━━━━━━━━━━━━━
Instagram
TikTok
YouTube
Combined Reach

Growth
━━━━━━━━━━━━━━━━━━━━━
7d
30d
90d
Momentum

Audience
━━━━━━━━━━━━━━━━━━━━━
Top Countries
Top Cities
Age Distribution
Audience Quality

Content
━━━━━━━━━━━━━━━━━━━━━
Primary Categories
Topics
Content Pillars
Top Formats
Posting Frequency

Performance
━━━━━━━━━━━━━━━━━━━━━
Average Views
Median Views
Engagement
Share Rate
Save Rate
Hit Rate

Positioning
━━━━━━━━━━━━━━━━━━━━━
Observed Positioning
Desired Positioning
Commercial Territories
Differentiators

Commercial
━━━━━━━━━━━━━━━━━━━━━
Available for campaigns
Preferred categories
Minimum Deal
Formats
Historical Brands

Intelligence
━━━━━━━━━━━━━━━━━━━━━
Growth Score
Audience Quality
Commercial Readiness
Momentum
Brand Attractiveness

Governance
━━━━━━━━━━━━━━━━━━━━━
Data Quality
Profile Completeness
Last Updated
Confidence
```

---

# 24. CREATOR DISCOVERY REQUIREMENTS

O modelo deve permitir futuramente buscar:

```text
Creators in Brazil
Creators in São Paulo
Creators who speak English
Creators between 100k and 500k followers
Creators growing >10% per month
Creators in Travel
Creators discussing Running
Creators with strong audience in Northeast Brazil
Creators with previous airline partnerships
Creators without airline partnerships
Creators open to travel
Creators with high engagement
Creators with strong audience quality
Creators who produce short-form video
Creators with specific professional skills
Creators with commercial availability
```

Isso significa que os campos P0 relevantes precisam estar queryable.

Evitar armazenar tudo apenas dentro de JSONB.

---

# 25. SUPABASE ARCHITECTURE

O banco será:

**Supabase PostgreSQL**

Usar:

```text
PostgreSQL
Supabase Auth
Supabase Storage
RLS
SQL migrations
generated TypeScript types
```

Possíveis capacidades futuras:

```text
pgvector
Edge Functions
Cron
Realtime
```

Não ativar tecnologias sem caso de uso.

---

# 26. MULTI-TENANCY

Modelo conceitual:

```text
User
↓
Membership
↓
Workspace
↓
Creator Resources
```

Tipos futuros de workspace:

```text
Oxente Internal
Creator
Agency
Brand
```

`workspace_id` é o principal tenant boundary para dados privados.

Perfis públicos/globalmente descobertos podem exigir estratégia adicional posteriormente.

Não misturar:

```text
global discovered creator
```

com:

```text
private workspace commercial data
```

sem governança explícita.

---

# 27. DATA VISIBILITY

Cada dado deverá conceitualmente possuir uma das classes:

```text
PUBLIC
WORKSPACE
RESTRICTED
HIGHLY_RESTRICTED
```

Exemplos:

PUBLIC:

```text
username
public bio
followers
public content
```

WORKSPACE:

```text
internal categories
internal notes
matching readiness
```

RESTRICTED:

```text
commercial email
rates
campaign financials
commercial preferences
```

HIGHLY_RESTRICTED:

```text
legal_name
manager_phone
commission_pct
private financial data
```

---

# 28. ROW LEVEL SECURITY

RLS deve ser considerado requisito arquitetural.

Princípios:

* workspaces não podem acessar dados privados de outros workspaces;
* public creator data pode possuir leitura mais ampla;
* restricted data exige membership;
* highly restricted data pode exigir role adicional;
* service role nunca deve ser exposto ao cliente;
* frontend não deve ser responsável sozinho por autorização.

---

# 29. API / APPLICATION BOUNDARY

Fluxo:

```text
UI
↓
API / Server Action
↓
Validation
↓
Application Use Case
↓
Domain
↓
Repository
↓
Supabase
```

Não colocar business logic diretamente em:

```text
React components
route handlers
SQL scattered across UI
LLM prompts
```

---

# 30. CONCEPTUAL APPLICATION USE CASES

A implementação deve considerar use cases como:

```text
CreateCreator
UpdateCreator
ArchiveCreator
ClaimCreator

AddPlatformAccount
UpdatePlatformAccount
SyncPlatformAccount

RecordAccountMetricSnapshot
CalculateGrowthMetrics

RecordAudienceSnapshot

AddCreatorCategory
AddCreatorTopic
UpdateContentPillars

CreateContentItem
RecordContentMetrics
CalculateContentPerformance

CreatePositioningProfile

AddBrandAffinity

UpdateCommercialProfile
AddCreatorRate
AddBrandRelationship
AddCreatorCampaign

AddRepresentation
AddCreatorContact

AssessBrandSafety

AddProfessionalAsset
AddOwnedAsset

UpdateMonetizationChannels
AssessBusinessMaturity

UpdateOpportunityPreferences
UpdateCommercialConstraints

GenerateCreatorIntelligenceAssessment

CalculateCreatorProfileCompleteness
CalculateCreatorDataQuality
CalculateMatchingReadiness
```

---

# 31. REPOSITORY BOUNDARY

Como Modular Monolith, uma possível organização é:

```text
src/
  modules/
    creators/
      domain/
      application/
      infrastructure/
      interfaces/

  platform/
    supabase/
    ai/
    jobs/
    integrations/

  shared/
```

Não é necessário criar camadas vazias apenas por arquitetura.

Princípio:

**Use abstractions only where they protect a meaningful boundary.**

---

# 32. DATABASE INDEX STRATEGY

Claude Code deve revisar queries esperadas antes de definir índices.

Candidates importantes:

```text
creators.slug
creators.workspace_id
creators.creator_status

creator_platform_accounts.creator_id
creator_platform_accounts.platform
creator_platform_accounts.username
creator_platform_accounts.external_platform_id

metric_snapshots.account_id + observed_at

creator_categories.creator_id + category_id
creator_categories.category_id + relevance_score

creator_topics.creator_id + topic_id
creator_topics.topic_id + relevance_score

content_items.creator_id + published_at

brand_relationships.creator_id + brand_id

brand_affinities.creator_id + brand_id

creator_contacts.creator_id

data_sources.provider
```

Não criar índices indiscriminadamente.

---

# 33. UNIQUE CONSTRAINTS

Candidates:

```text
creator.slug UNIQUE

(platform, external_platform_id) UNIQUE
where external_platform_id is not null

creator_id + language_code UNIQUE

creator_id + category_id UNIQUE for active category assignment

creator_id + topic_id UNIQUE for active topic representation
```

Content deduplication deve considerar:

```text
account_id + platform_content_id
```

---

# 34. DATA QUALITY SCORE

O sistema deve possuir cálculo versionado de qualidade do profile.

Possíveis dimensões:

```text
identity_quality
account_coverage
metric_freshness
audience_coverage
content_coverage
positioning_coverage
commercial_coverage
provenance_quality
```

Exemplo conceitual:

```text
data_quality_score =
weighted(
 identity_quality,
 metric_freshness,
 source_reliability,
 completeness,
 consistency
)
```

Não hardcode fórmula final nesta especificação.

---

# 35. PROFILE COMPLETENESS

Diferente de Data Quality.

Completeness mede:

> quantos dados esperados temos?

Quality mede:

> quão confiáveis são esses dados?

Exemplo:

```text
completeness = 92%
quality = 58%
```

pode ocorrer.

---

# 36. PROVENANCE MODEL

Exemplo:

```text
Creator Topic:
"Running"

Source:
Instagram content

Evidence:
17 posts relacionados a running

Observation:
01 Jun - 28 Aug

AI model:
content-classifier-v2

Confidence:
0.91
```

Isso é preferível a simplesmente armazenar:

```text
running = true
```

---

# 37. CONTENT CLASSIFICATION

O sistema deve suportar:

```text
Content Item
↓
Topics
↓
Categories
↓
Content Pillars
↓
Commercial Territories
```

Exemplo:

```text
Post:
"Treino para minha primeira meia maratona"

Topics:
running
fitness
sportswear

Category:
Fitness

Pillar:
Health & Active Lifestyle

Commercial Territory:
Sports / Wellness
```

---

# 38. OBSERVED VS DESIRED POSITIONING

Este conceito é central.

Exemplo:

```text
OBSERVED

Entertainment 45%
Lifestyle 30%
Travel 15%
Fashion 10%
```

Creator quer:

```text
DESIRED

Travel 35%
Lifestyle 30%
Entertainment 20%
Fashion 15%
```

Isso permite futuramente que Positioning Agent e Content Agent ajudem a mudar percepção comercial.

---

# 39. BRAND AFFINITY VS BRAND RELATIONSHIP

Não misturar.

```text
Brand Affinity
```

significa:

> Existe conexão entre creator e marca.

Pode ser:

```text
organic
content
audience
cultural
aspirational
```

`Brand Relationship` significa:

> Existe ou existiu uma relação concreta.

Exemplo:

```text
campaign
ambassador
affiliate
event
```

---

# 40. MATCH SCORE DOES NOT BELONG TO CREATOR

Nunca criar:

```text
creator.nike_match_score
```

Match é relacionamento:

```text
Creator
    ↓
  Match
    ↑
 Brand
```

Da mesma maneira:

```text
Opportunity Score
```

pertence a:

```text
Creator
×
Brand
×
Context
×
Timing
```

e não ao Creator Intelligence.

---

# 41. OBSERVABILITY

Monitorar:

```text
creator_created_total
creator_updated_total

profile_completeness_avg
data_quality_avg

accounts_sync_total
accounts_sync_failure_rate

metric_snapshots_created

content_items_ingested

AI_assessment_success_rate
AI_assessment_failure_rate

AI_cost_per_creator
AI_latency

profiles_ready_for_matching
profiles_not_ready_for_matching

stale_creator_profiles
```

---

# 42. DATA QUALITY DIMENSIONS

Monitorar:

```text
completeness
validity
consistency
uniqueness
freshness
provenance
confidence
```

---

# 43. TESTING STRATEGY

## Domain tests

Testar:

```text
creator identity rules
creator status transitions
duplicate handling
metric snapshot behavior
growth calculations
profile completeness
data quality
matching readiness
commercial constraint validity
temporal profile validity
```

## Integration tests

Testar:

```text
Supabase persistence
foreign keys
unique constraints
RLS
migrations
snapshot insertion
profile retrieval
creator aggregation
```

## AI evaluation

Não utilizar apenas testes booleanos.

Criar dataset de avaliação para:

```text
category classification
topic extraction
positioning analysis
brand detection
commercial territory detection
brand safety
creator summary
```

Monitorar:

```text
precision
recall where possible
human agreement
confidence calibration
hallucination rate
```

---

# 44. NON-FUNCTIONAL REQUIREMENTS

## Performance

Creator Profile principal deve ser obtido sem exigir dezenas de queries independentes do frontend.

Criar application-level aggregation ou read model apropriado.

## Scalability

Modelo deve suportar:

```text
100 creators
1,000 creators
100,000 creators
```

sem mudança conceitual de domínio.

Não é necessário otimizar desde já para milhões.

## Reliability

Ingestion precisa ser idempotente quando possível.

## Maintainability

Provider-specific logic deve ficar isolada.

## Explainability

AI-derived field precisa ser rastreável.

## Security

Dados privados não podem vazar entre workspaces.

---

# 45. MVP — P0

P0 é a primeira implementação.

Criar prioritariamente:

```text
creators
creator_locations
creator_languages
creator_platform_accounts
creator_account_metric_snapshots
creator_growth_metrics

creator_audience_snapshots
creator_audience_geography
creator_audience_age_bands

taxonomy_categories
taxonomy_topics
creator_categories
creator_topics
creator_content_pillars

creator_content_items
creator_content_metric_snapshots
creator_content_performance_aggregates

creator_positioning_profiles

creator_brand_affinities
creator_brand_relationships

creator_commercial_profiles
creator_opportunity_preferences
creator_commercial_constraints

creator_contacts

creator_intelligence_assessments

data_sources
evidence_items
```

P0 não exige que todas as tabelas estejam populadas automaticamente.

O objetivo é construir o modelo e os fluxos essenciais.

---

# 46. P1

Depois da primeira validação:

```text
creator_rates
creator_campaigns
creator_commercial_effectiveness

creator_audience_quality_assessments

creator_representations

creator_brand_safety_assessments

creator_professional_assets
creator_owned_assets

creator_monetization_channels
```

---

# 47. P2

Evolução:

```text
creator_business_maturity_profiles

advanced creator embeddings

semantic discovery

predictive commercial models

creator marketability models

advanced audience quality

multi-platform identity resolution

automated enrichment

automated Creator Intelligence Agent
```

---

# 48. USER EXPERIENCE — CREATOR LIST

Mesmo não sendo foco principal deste SDD, a estrutura deve suportar uma listagem conceitualmente semelhante a:

```text
Creator
Platforms
Primary Category
Location
Followers
30d Growth
Avg Views
Audience Quality
Commercial Readiness
Data Quality
Last Updated
```

Filtros:

```text
Platform
Category
Topic
Location
Language
Follower Range
Growth
Engagement
Audience Quality
Commercial Availability
Brand History
Professional Skills
Matching Readiness
```

---

# 49. USER EXPERIENCE — CREATOR DETAIL

Tabs/seções recomendadas:

```text
Overview

Audience

Content

Performance

Positioning

Brands

Commercial

Assets

Intelligence

Data Sources
```

---

# 50. CREATOR OVERVIEW

Mostrar:

```text
Identity
Social Accounts
Combined Audience
Primary Categories
Primary Topics
Growth
Avg Performance
Audience Geography
Commercial Status
Brand History
Creator Intelligence Summary
Data Confidence
```

---

# 51. CREATOR READ MODEL

Não exigir que UI conheça todas as tabelas.

Criar um conceito de:

```text
CreatorProfile
```

ou equivalente no Application Layer.

Exemplo conceitual:

```text
CreatorProfile {
    creator
    accounts
    audience
    growth
    categories
    topics
    contentPerformance
    positioning
    brandRelationships
    affinities
    commercial
    intelligence
    dataQuality
}
```

Este é um read model.

Não é necessariamente uma tabela.

---

# 52. CREATOR DISCOVERY READ MODEL

Posteriormente pode existir:

```text
CreatorDiscoveryDocument
```

otimizado para busca.

Campos possíveis:

```text
creator_id
name
location
categories
topics
platforms
followers
growth
average_views
engagement
audience_geography
languages
commercial_status
professional_assets
commercial_territories
embedding
```

Não criar infraestrutura dedicada de search até necessidade concreta.

PostgreSQL deve ser primeira opção.

---

# 53. CREATOR EMBEDDINGS

pgvector pode ser introduzido somente quando semantic search estiver sendo utilizado.

Possíveis embeddings:

```text
creator_embedding
content_embedding
commercial_embedding
```

Não gerar embeddings apenas porque pgvector está disponível.

---

# 54. AGENTIC FUTURE

Creator Intelligence Agent será futuramente responsável por:

```text
Discover Creator
↓
Resolve Identity
↓
Collect Sources
↓
Enrich Profile
↓
Analyze Content
↓
Update Categories
↓
Update Topics
↓
Analyze Positioning
↓
Detect Brands
↓
Assess Commercial Readiness
↓
Produce Creator Intelligence
```

Mas:

**Creator Intelligence Agent é uma implementação futura da capability.**

O domínio não deve depender da existência do agente.

---

# 55. DEFINITION OF DONE — P0

A feature P0 estará concluída quando:

1. Um Creator canônico puder ser criado.
2. Múltiplas contas sociais puderem ser associadas ao mesmo Creator.
3. O sistema impedir duplicações óbvias.
4. Métricas puderem ser armazenadas como snapshots históricos.
5. Growth puder ser derivado dos snapshots.
6. Localizações e mercados puderem ser representados.
7. Idiomas puderem ser representados.
8. Audience Snapshot puder ser armazenado.
9. Distribuição geográfica puder ser armazenada.
10. Age bands puderem ser armazenados.
11. Categories puderem ser associadas ao creator.
12. Topics puderem ser associados ao creator.
13. Content Pillars puderem ser representados.
14. Conteúdos individuais puderem ser armazenados.
15. Métricas históricas de conteúdo puderem ser armazenadas.
16. Performance agregada puder ser calculada.
17. Observed Positioning puder ser armazenado.
18. Desired Positioning puder ser armazenado.
19. Brand Affinity puder ser registrada.
20. Brand Relationship puder ser registrada.
21. Commercial Profile puder ser representado.
22. Opportunity Preferences puderem ser armazenadas.
23. Commercial Constraints puderem ser armazenadas.
24. Creator Contacts puderem ser registrados com visibilidade apropriada.
25. Data Source puder ser registrada.
26. Evidence puder ser ligada a uma entidade ou atributo.
27. AI Intelligence Assessment puder ser versionada.
28. Profile Completeness puder ser calculada.
29. Data Quality puder ser calculada.
30. Matching Readiness puder ser determinado.
31. RLS impedir acesso cross-workspace indevido.
32. Migrations estiverem versionadas.
33. Generated TypeScript types estiverem atualizados.
34. Tests essenciais estiverem passando.
35. O Creator Intelligence Profile puder ser consultado pela aplicação.
36. O sistema souber diferenciar fato, observação, declaração, derivação e inferência.
37. O sistema consiga informar quando os principais dados foram observados.
38. Nenhum atributo sensível proibido seja inferido para matching.

---

# 56. P0 END-TO-END ACCEPTANCE SCENARIO

Dado:

```text
Instagram URL de um creator
```

a arquitetura deve permitir o fluxo:

```text
Creator URL
↓
Create / Resolve Creator
↓
Create Platform Account
↓
Store Source
↓
Store Account Observation
↓
Store Metrics Snapshot
↓
Store Content
↓
Analyze Content
↓
Assign Categories
↓
Assign Topics
↓
Generate Content Pillars
↓
Create Positioning Profile
↓
Create Creator Intelligence Assessment
↓
Calculate Data Quality
↓
Calculate Profile Completeness
↓
Calculate Matching Readiness
↓
Creator Intelligence Profile
```

A coleta automática dos dados pode ser implementada por fases.

O modelo não deve depender da automação estar pronta.

---

# 57. OPEN DECISIONS

Não decidir silenciosamente durante implementação.

Registrar como ADR ou technical decision caso necessário:

```text
Global Creator vs Workspace-owned Creator model

Definitive creator tier thresholds

Final taxonomy hierarchy

Provider strategy for Instagram

Provider strategy for TikTok

Provider strategy for YouTube

Third-party influencer data providers

Content ingestion limits

Raw payload retention period

Raw content retention policy

Embedding model/provider

AI provider

AI evaluation framework

Creator duplicate resolution thresholds

Exact Data Quality formula

Exact Profile Completeness formula

Matching Readiness formula

Creator Intelligence refresh cadence

Audience quality provider/model

Search strategy

Potential materialized views/read models
```

---

# 58. ARCHITECTURAL CONSTRAINTS

Não introduzir durante esta implementação sem justificativa:

```text
Microservices
Kafka
Kubernetes
Redis
MongoDB
Neo4j
Elasticsearch
Pinecone
Dedicated Vector DB
LangChain as architecture
LangGraph as architecture
CrewAI as architecture
CQRS
Event Sourcing
```

Essas tecnologias não estão proibidas para sempre.

Elas apenas não são justificadas no estágio atual.

---

# 59. ARCHITECTURE FITNESS RULES

Todas as decisões futuras devem seguir:

```text
Optimize for learning before scale.

Managed infrastructure before custom infrastructure.

Modular monolith before distributed systems.

PostgreSQL before another database.

Canonical data before provider-specific coupling.

Historical observations before mutable metrics.

Evidence before inference.

Explainability before opaque scoring.

Product capability before agent implementation.

Explicit domain boundaries before microservices.

Every new infrastructure component must solve a demonstrated problem.
```

---

# 60. IMPLEMENTATION DELIVERABLES EXPECTED FROM CLAUDE CODE

Ao implementar este SDD, produzir:

```text
1. Database schema design
2. Supabase migrations
3. Foreign keys
4. Constraints
5. Indexes
6. RLS policies
7. Generated TypeScript types
8. Creator domain model
9. Application use cases
10. Repository/data access layer
11. Creator Profile read model
12. Validation schemas
13. API/application interfaces
14. Seed taxonomies
15. Minimal Creator management UI if consistent with existing project
16. Tests
17. Data quality / completeness service
18. Matching readiness service
19. Documentation update
20. Implementation summary
```

Antes de implementar, apresentar:

```text
IMPLEMENTATION PLAN

Files to create
Files to modify
Database migrations
Domain changes
Application changes
UI changes
Tests
Risks
Assumptions
```

Depois executar em fases.

---

# 61. IMPORTANT IMPLEMENTATION RULE

Não é obrigatório criar fisicamente todas as 39 tabelas no primeiro commit.

O SDD descreve o **target domain model**.

A implementação deve diferenciar:

```text
P0 REQUIRED NOW

P1 PREPARED FOR

P2 FUTURE
```

Mas nenhuma decisão P0 deve impossibilitar a evolução para o modelo completo.

---

# 62. FINAL PRODUCT RULE

A feature não está pronta simplesmente quando existe:

```text
CREATE TABLE creators
```

Ela estará conceitualmente pronta quando a Oxente conseguir representar um creator como:

```text
IDENTITY
+
AUDIENCE
+
CONTENT
+
PERFORMANCE
+
POSITIONING
+
COMMERCIAL INTELLIGENCE
+
BRAND RELATIONSHIPS
+
PREFERENCES
+
HISTORICAL DATA
+
PROVENANCE
+
AI INTELLIGENCE
```

e entregar isso como um:

# CREATOR INTELLIGENCE PROFILE

capaz de alimentar:

```text
CREATOR DISCOVERY
        ↓
MATCHMAKING
        ↓
OPPORTUNITY ENGINE
        ↓
COMMERCIAL REVENUE
```

Essa é a definição arquitetural e de produto da feature **Creator Intelligence Database** da Oxente Creator.
