-- SDD §8.2 creator_locations, §8.3 creator_languages

create type creator_location_type as enum (
  'current_residence', 'origin', 'market_served', 'travel_market', 'frequent_market'
);

create table creator_locations (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  location_type creator_location_type not null,
  country_code char(2),
  state_region text,
  city text,
  metro_area text,
  relevance_score numeric check (relevance_score is null or (relevance_score >= 0 and relevance_score <= 1)),
  travel_available boolean,
  remote_campaign_available boolean,
  international_campaigns_available boolean,
  valid_from date,
  valid_to date,
  source_confidence numeric check (source_confidence is null or (source_confidence >= 0 and source_confidence <= 1))
);

create index creator_locations_creator_id_idx on creator_locations(creator_id);

create type language_proficiency as enum (
  'native', 'fluent', 'advanced', 'intermediate', 'basic'
);

create table creator_languages (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  language_code text not null,
  proficiency language_proficiency,
  content_language boolean not null default false,
  commercial_language boolean not null default false,
  content_share_pct numeric check (content_share_pct is null or (content_share_pct >= 0 and content_share_pct <= 100)),
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  unique (creator_id, language_code)
);

create index creator_languages_creator_id_idx on creator_languages(creator_id);

alter table creator_locations enable row level security;
alter table creator_languages enable row level security;

create policy creator_locations_select_visible
  on creator_locations for select
  to authenticated
  using (creator_is_visible(creator_id));

create policy creator_languages_select_visible
  on creator_languages for select
  to authenticated
  using (creator_is_visible(creator_id));

-- Writes are service-role-only in Phase 1, same rationale as `creators`.
