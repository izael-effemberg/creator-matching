/**
 * Domain-facing aliases for the Postgres enums backing the Creator module.
 * Single source of truth is the database schema (supabase/migrations/) —
 * these are re-exported from the generated types, never hand-duplicated.
 * Regenerate `database.types.ts` (npx supabase gen types typescript --local)
 * whenever a migration adds/changes an enum; these aliases pick it up
 * automatically.
 */
import type { Enums } from "@/platform/supabase/database.types";

export type CreatorType = Enums<"creator_type">;
export type CreatorStatus = Enums<"creator_status">;
export type CreatorTier = Enums<"creator_tier">;
export type AdultStatus = Enums<"adult_status">;
export type CreatorLocationType = Enums<"creator_location_type">;
export type LanguageProficiency = Enums<"language_proficiency">;
export type CreatorPlatform = Enums<"creator_platform">;
export type PlatformAccountStatus = Enums<"platform_account_status">;
export type PlatformAccessScope = Enums<"platform_access_scope">;
export type PlatformSyncStatus = Enums<"platform_sync_status">;
export type MetricWindow = Enums<"metric_window">;
export type DataSourceType = Enums<"data_source_type">;
export type DataSourceAccessScope = Enums<"data_source_access_scope">;
export type EvidenceType = Enums<"evidence_type">;
