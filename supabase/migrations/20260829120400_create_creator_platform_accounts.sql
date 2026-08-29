-- SDD §8.4 creator_platform_accounts
-- Principle (SDD §6.1/§6.2): Instagram/TikTok/etc. are data sources, not the
-- domain. A Creator is independent of any single platform account.

create type creator_platform as enum (
  'instagram', 'tiktok', 'youtube', 'linkedin', 'twitch', 'x',
  'facebook', 'pinterest', 'newsletter', 'podcast', 'website', 'other'
);

create type platform_account_status as enum (
  'active', 'inactive', 'suspended', 'deleted', 'unknown'
);

create type platform_access_scope as enum (
  'public', 'authorized', 'licensed', 'restricted', 'internal'
);

create type platform_sync_status as enum (
  'success', 'partial', 'failed', 'never_synced'
);

create table creator_platform_accounts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  platform creator_platform not null,
  external_platform_id text,
  username text,
  display_name text,
  profile_url text not null,
  bio text,
  avatar_url text,
  website_url text,
  verified boolean,
  account_type text,
  account_status platform_account_status not null default 'unknown',
  is_primary_account boolean not null default false,
  is_creator_authorized boolean not null default false,
  access_scope platform_access_scope not null default 'public',
  last_synced_at timestamptz,
  last_sync_status platform_sync_status not null default 'never_synced',
  raw_metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Content dedup and identity resolution both key off (platform, external_platform_id)
-- when we actually have that id; SDD §16 explicitly warns against merging
-- purely on name similarity, so this constraint is deliberately narrow and
-- only applies once we actually have a provider-issued id.
create unique index creator_platform_accounts_platform_external_id_key
  on creator_platform_accounts(platform, external_platform_id)
  where external_platform_id is not null;

create index creator_platform_accounts_creator_id_idx on creator_platform_accounts(creator_id);
create index creator_platform_accounts_platform_idx on creator_platform_accounts(platform);
create index creator_platform_accounts_username_idx on creator_platform_accounts(username);

create trigger creator_platform_accounts_set_updated_at
  before update on creator_platform_accounts
  for each row
  execute function set_updated_at();

-- RLS helper: visibility of a platform account follows its creator's
-- visibility. Reused by the metrics tables in the next migration.
create or replace function creator_account_is_visible(p_account_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_creator_id uuid;
begin
  select creator_id into v_creator_id
  from creator_platform_accounts
  where id = p_account_id;

  if not found then
    return false;
  end if;

  return creator_is_visible(v_creator_id);
end;
$$;

alter table creator_platform_accounts enable row level security;

create policy creator_platform_accounts_select_visible
  on creator_platform_accounts for select
  to authenticated
  using (creator_is_visible(creator_id));

-- Writes are service-role-only in Phase 1: platform account linking today
-- happens via ingestion (manual entry / discovery), not a user-facing OAuth
-- flow — SDD's "creator-authorized API" onboarding method is follow-up work.
