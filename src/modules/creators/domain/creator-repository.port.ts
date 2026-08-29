/**
 * CreatorRepository — the port. Application use cases depend on this
 * interface, never on Supabase directly (domain-architecture.md API
 * Architecture: Domain -> Repository, not Domain -> Infrastructure).
 * Implemented by infrastructure/supabase-creator-repository.ts.
 */
import type { Creator } from "./creator";
import type { PlatformAccount } from "./platform-account";
import type { AccountMetricSnapshot } from "./metric-snapshot";
import type { GrowthMetricsInput } from "./growth-metrics";
import type { Tables, TablesInsert } from "@/platform/supabase/database.types";

export type CreatorLocation = Tables<"creator_locations">;
export type CreatorLanguage = Tables<"creator_languages">;
export type GrowthMetricsRow = Tables<"creator_growth_metrics">;

export type CreateCreatorInput = Pick<
  TablesInsert<"creators">,
  | "slug"
  | "display_name"
  | "workspace_id"
  | "stage_name"
  | "creator_type"
  | "primary_market"
  | "timezone"
>;

export interface CreatorRepository {
  findById(id: string): Promise<Creator | null>;
  findBySlug(slug: string): Promise<Creator | null>;
  create(input: CreateCreatorInput): Promise<Creator>;
  list(params: { limit: number; offset: number }): Promise<{ creators: Creator[]; total: number }>;

  addPlatformAccount(
    input: Pick<
      TablesInsert<"creator_platform_accounts">,
      "creator_id" | "platform" | "profile_url" | "username" | "external_platform_id" | "is_primary_account"
    >,
  ): Promise<PlatformAccount>;
  listPlatformAccounts(creatorId: string): Promise<PlatformAccount[]>;
  findPlatformAccountById(id: string): Promise<PlatformAccount | null>;

  recordAccountMetricSnapshot(
    input: Pick<
      TablesInsert<"creator_account_metric_snapshots">,
      "account_id" | "observed_at" | "followers_count" | "following_count" | "content_count" | "source_id" | "raw_metrics"
    >,
  ): Promise<AccountMetricSnapshot>;
  listAccountMetricSnapshots(accountId: string, params?: { limit?: number }): Promise<AccountMetricSnapshot[]>;

  saveGrowthMetrics(input: GrowthMetricsInput): Promise<GrowthMetricsRow>;
  latestGrowthMetrics(accountId: string): Promise<GrowthMetricsRow[]>;

  listLocations(creatorId: string): Promise<CreatorLocation[]>;
  listLanguages(creatorId: string): Promise<CreatorLanguage[]>;
}
