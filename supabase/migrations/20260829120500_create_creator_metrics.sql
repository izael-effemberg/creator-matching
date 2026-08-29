-- SDD §8.5 creator_account_metric_snapshots, §8.6 creator_growth_metrics
-- Principle (SDD §6.3 — Historical Data First): never overwrite a metric,
-- always append a new observation. Growth is derived from snapshots, not
-- stored as a mutable running total.

create table creator_account_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references creator_platform_accounts(id) on delete cascade,
  observed_at timestamptz not null,
  followers_count bigint,
  following_count bigint,
  content_count bigint,
  total_views bigint,
  total_likes bigint,
  total_comments bigint,
  total_shares bigint,
  total_saves bigint,
  profile_views bigint,
  reach bigint,
  impressions bigint,
  source_id uuid references data_sources(id) on delete set null,
  raw_metrics jsonb,
  ingested_at timestamptz not null default now()
);

-- Never overwritten; this index is the query path for "latest snapshot" and
-- for building a time series (SDD §12 fast-changing data).
create index creator_account_metric_snapshots_account_observed_idx
  on creator_account_metric_snapshots(account_id, observed_at desc);

create type metric_window as enum (
  '7d', '30d', '90d', '365d', 'custom'
);

create table creator_growth_metrics (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references creator_platform_accounts(id) on delete cascade,
  "window" metric_window not null,
  window_start timestamptz not null,
  window_end timestamptz not null,
  follower_growth_absolute bigint,
  follower_growth_pct numeric,
  avg_daily_follower_growth numeric,
  growth_velocity numeric,
  growth_acceleration numeric,
  content_growth_correlation numeric,
  viral_growth_flag boolean not null default false,
  audience_decay_flag boolean not null default false,
  calculation_version text not null,
  calculated_at timestamptz not null default now()
);

create index creator_growth_metrics_account_window_idx
  on creator_growth_metrics(account_id, "window", window_end desc);

alter table creator_account_metric_snapshots enable row level security;
alter table creator_growth_metrics enable row level security;

create policy creator_account_metric_snapshots_select_visible
  on creator_account_metric_snapshots for select
  to authenticated
  using (creator_account_is_visible(account_id));

create policy creator_growth_metrics_select_visible
  on creator_growth_metrics for select
  to authenticated
  using (creator_account_is_visible(account_id));

-- Writes are service-role-only in Phase 1: snapshots come from ingestion
-- (SDD §14 ingestion flow) and growth is a derived/calculated_version'd
-- service output (application/services/growth), never client-written.
