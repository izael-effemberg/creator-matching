-- Workspace multi-tenancy prerequisite (ADR-007: partial delivery — see
-- harness/01-knowledge/decisions/adr/011-creator-ownership-model.md for why
-- this exists ahead of the full User/Membership/role model).
--
-- workspaces / workspace_members are the minimal tables needed for RLS to
-- have something to join against. Roles, invitations, and workspace types
-- (Oxente internal / Creator / Agency / Brand) are explicitly out of scope
-- here and remain follow-up work.

create extension if not exists "pgcrypto";

-- Reusable trigger function: keeps `updated_at` current on any UPDATE.
-- Reused by every table in this and later migrations that has an
-- `updated_at` column — do not redefine per table.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger workspaces_set_updated_at
  before update on workspaces
  for each row
  execute function set_updated_at();

create table workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index workspace_members_user_id_idx on workspace_members(user_id);

-- RLS helper: is the current auth.uid() a member of this workspace?
-- security definer so it can read workspace_members regardless of the
-- caller's own RLS visibility into that table (avoids recursive policy
-- evaluation). Reused by every workspace-scoped policy from here on.
create or replace function is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from workspace_members m
    where m.workspace_id = p_workspace_id
      and m.user_id = auth.uid()
  );
$$;

alter table workspaces enable row level security;
alter table workspace_members enable row level security;

create policy workspaces_select_members
  on workspaces for select
  to authenticated
  using (is_workspace_member(id));

create policy workspace_members_select_own_workspace
  on workspace_members for select
  to authenticated
  using (is_workspace_member(workspace_id));

-- No insert/update/delete policy for `authenticated`/`anon` on either table:
-- workspace and membership management is service-role-only for now
-- (service_role bypasses RLS) — there is no self-serve workspace creation
-- flow yet.
