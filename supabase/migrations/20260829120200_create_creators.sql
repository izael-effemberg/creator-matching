-- Creator Intelligence Database — canonical creator entity.
-- Spec: harness/02-intent/specs/creator/creator-intelligence-database.md (SDD §8.1)
-- Ownership model decision: harness/01-knowledge/decisions/adr/011-creator-ownership-model.md
--   workspace_id NULL   = globally discovered/canonical creator, broadly readable
--   workspace_id not null = workspace-scoped creator record

create type creator_type as enum (
  'individual', 'duo', 'group', 'company', 'virtual'
);

create type creator_status as enum (
  'prospect', 'active', 'managed', 'inactive', 'archived'
);

create type creator_tier as enum (
  'nano', 'micro', 'mid', 'macro', 'mega', 'celebrity'
);

create type adult_status as enum (
  'adult', 'minor', 'unknown'
);

create table creators (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete set null,
  slug text not null unique,
  display_name text not null,
  stage_name text,
  legal_name text,
  headline text,
  bio text,
  profile_image_url text,
  creator_type creator_type not null default 'individual',
  creator_status creator_status not null default 'prospect',
  creator_tier creator_tier,
  is_verified_creator boolean not null default false,
  is_claimed boolean not null default false,
  adult_status adult_status not null default 'unknown',
  primary_market text,
  timezone text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz,
  data_quality_score numeric check (data_quality_score is null or (data_quality_score >= 0 and data_quality_score <= 1)),
  profile_completeness numeric check (profile_completeness is null or (profile_completeness >= 0 and profile_completeness <= 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index creators_workspace_id_idx on creators(workspace_id);
create index creators_creator_status_idx on creators(creator_status);

create trigger creators_set_updated_at
  before update on creators
  for each row
  execute function set_updated_at();

-- RLS helper: is this creator visible to the current caller? Reused by
-- every creator-scoped child table added in later migrations instead of
-- repeating the same join.
create or replace function creator_is_visible(p_creator_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_workspace_id uuid;
  v_found boolean;
begin
  select workspace_id, true into v_workspace_id, v_found
  from creators
  where id = p_creator_id and deleted_at is null;

  if not found then
    return false;
  end if;

  if v_workspace_id is null then
    return true; -- globally discovered creator: broad read
  end if;

  return is_workspace_member(v_workspace_id);
end;
$$;

alter table creators enable row level security;

create policy creators_select_visible
  on creators for select
  to authenticated
  using (deleted_at is null and (workspace_id is null or is_workspace_member(workspace_id)));

-- No insert/update/delete policy for authenticated/anon: creator ingestion
-- (manual entry, discovery, enrichment) is service-role-only in Phase 1 —
-- there is no self-serve "claim your profile" flow yet (SDD §15 Method A-D,
-- §16 identity resolution are all follow-up work).
