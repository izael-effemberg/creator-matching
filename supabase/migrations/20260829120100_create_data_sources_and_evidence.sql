-- Provenance registry (ADR-009 — Evidence-First Intelligence).
-- SOURCE -> EVIDENCE -> SIGNAL -> FEATURE -> ... : this migration covers the
-- first two links, referenced by creator_* tables added later.

create type data_source_type as enum (
  'platform_api',
  'public_web',
  'creator_provided',
  'agency_provided',
  'manual',
  'internal',
  'ai_inference',
  'third_party'
);

create type data_source_access_scope as enum (
  'public',
  'authorized',
  'licensed',
  'restricted',
  'internal'
);

create table data_sources (
  id uuid primary key default gen_random_uuid(),
  source_type data_source_type not null,
  provider text,
  source_url text,
  external_id text,
  access_scope data_source_access_scope not null default 'internal',
  terms_context text,
  retrieved_at timestamptz,
  observed_at timestamptz,
  raw_payload_hash text,
  raw_payload_location text,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  created_at timestamptz not null default now()
);

create index data_sources_provider_idx on data_sources(provider);

create type evidence_type as enum (
  'raw_value',
  'quote',
  'metric',
  'content_reference',
  'manual_attestation',
  'model_input'
);

-- Polymorphic reference (entity_type/entity_id) by design: evidence backs
-- attributes on creators today, brands/opportunities later, without a
-- separate evidence table per domain. See ADR-009.
create table evidence_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references data_sources(id) on delete restrict,
  entity_type text not null,
  entity_id uuid not null,
  field_name text,
  evidence_type evidence_type not null,
  raw_value jsonb,
  evidence_text text,
  observed_at timestamptz not null default now(),
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index evidence_items_entity_idx on evidence_items(entity_type, entity_id);
create index evidence_items_source_id_idx on evidence_items(source_id);

alter table data_sources enable row level security;
alter table evidence_items enable row level security;

-- Phase 1 default: provenance is internal plumbing, not yet exposed to
-- workspace-scoped clients. Only service_role (bypasses RLS) reads/writes
-- these for now. Revisit once evidence needs to be shown in a Creator
-- Intelligence Profile UI backed by the anon/authenticated roles.
