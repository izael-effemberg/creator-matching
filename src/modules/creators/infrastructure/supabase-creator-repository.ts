import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/platform/supabase/database.types";
import type {
  CreatorRepository,
  CreateCreatorInput,
  CreatorLocation,
  CreatorLanguage,
  GrowthMetricsRow,
} from "../domain/creator-repository.port";
import type { Creator } from "../domain/creator";
import type { PlatformAccount } from "../domain/platform-account";
import type { AccountMetricSnapshot } from "../domain/metric-snapshot";
import type { GrowthMetricsInput } from "../domain/growth-metrics";

/**
 * Supabase implementation of the CreatorRepository port. Every method maps
 * 1:1 to a table from supabase/migrations/ — no business logic here, that
 * lives in application/ and domain/. Throws the raw Postgrest error on
 * failure; use cases decide what that means domain-wise (e.g. unique
 * violations -> DuplicateCreatorSlugError).
 */
export class SupabaseCreatorRepository implements CreatorRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: string): Promise<Creator | null> {
    const { data, error } = await this.client
      .from("creators")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findBySlug(slug: string): Promise<Creator | null> {
    const { data, error } = await this.client
      .from("creators")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(input: CreateCreatorInput): Promise<Creator> {
    const { data, error } = await this.client.from("creators").insert(input).select("*").single();
    if (error) throw error;
    return data;
  }

  async list(params: { limit: number; offset: number }): Promise<{ creators: Creator[]; total: number }> {
    const { data, error, count } = await this.client
      .from("creators")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(params.offset, params.offset + params.limit - 1);
    if (error) throw error;
    return { creators: data ?? [], total: count ?? 0 };
  }

  async addPlatformAccount(
    input: Parameters<CreatorRepository["addPlatformAccount"]>[0],
  ): Promise<PlatformAccount> {
    const { data, error } = await this.client
      .from("creator_platform_accounts")
      .insert(input)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  async listPlatformAccounts(creatorId: string): Promise<PlatformAccount[]> {
    const { data, error } = await this.client
      .from("creator_platform_accounts")
      .select("*")
      .eq("creator_id", creatorId)
      .order("is_primary_account", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async findPlatformAccountById(id: string): Promise<PlatformAccount | null> {
    const { data, error } = await this.client
      .from("creator_platform_accounts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async recordAccountMetricSnapshot(
    input: Parameters<CreatorRepository["recordAccountMetricSnapshot"]>[0],
  ): Promise<AccountMetricSnapshot> {
    const { data, error } = await this.client
      .from("creator_account_metric_snapshots")
      .insert(input)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  async listAccountMetricSnapshots(
    accountId: string,
    params?: { limit?: number },
  ): Promise<AccountMetricSnapshot[]> {
    const { data, error } = await this.client
      .from("creator_account_metric_snapshots")
      .select("*")
      .eq("account_id", accountId)
      .order("observed_at", { ascending: false })
      .limit(params?.limit ?? 100);
    if (error) throw error;
    return data ?? [];
  }

  async saveGrowthMetrics(input: GrowthMetricsInput): Promise<GrowthMetricsRow> {
    const { data, error } = await this.client
      .from("creator_growth_metrics")
      .insert(input)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  async latestGrowthMetrics(accountId: string): Promise<GrowthMetricsRow[]> {
    const { data, error } = await this.client
      .from("creator_growth_metrics")
      .select("*")
      .eq("account_id", accountId)
      .order("calculated_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    return data ?? [];
  }

  async listLocations(creatorId: string): Promise<CreatorLocation[]> {
    const { data, error } = await this.client
      .from("creator_locations")
      .select("*")
      .eq("creator_id", creatorId);
    if (error) throw error;
    return data ?? [];
  }

  async listLanguages(creatorId: string): Promise<CreatorLanguage[]> {
    const { data, error } = await this.client
      .from("creator_languages")
      .select("*")
      .eq("creator_id", creatorId);
    if (error) throw error;
    return data ?? [];
  }
}
