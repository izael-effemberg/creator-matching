/**
 * Integration test against a real local Supabase instance (`npx supabase
 * start`). Skipped automatically when SUPABASE_URL isn't set — e.g. in an
 * environment without Docker — rather than failing the whole suite; see
 * harness/04-feedback/tests/strategy.md.
 *
 * Uses the service-role client directly (not platform/supabase/server-client.ts,
 * which is guarded by the `server-only` package and will throw outside a
 * Next.js server context — appropriate for app code, not for this test).
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/platform/supabase/database.types";
import { SupabaseCreatorRepository } from "./supabase-creator-repository";
import { createCreator } from "../application/use-cases/create-creator";
import { addPlatformAccount } from "../application/use-cases/add-platform-account";
import { recordAccountMetricSnapshot } from "../application/use-cases/record-account-metric-snapshot";
import { calculateGrowthMetricsUseCase } from "../application/use-cases/calculate-growth-metrics";
import { getCreatorProfile } from "../application/use-cases/get-creator-profile";
import { DuplicateCreatorSlugError } from "../domain/creator";

const hasLocalSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

describe.skipIf(!hasLocalSupabase)("SupabaseCreatorRepository (integration)", () => {
  let client: SupabaseClient<Database>;
  let repository: SupabaseCreatorRepository;
  const slug = `integration-test-${Date.now()}`;

  beforeAll(() => {
    client = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    repository = new SupabaseCreatorRepository(client);
  });

  afterAll(async () => {
    await client.from("creators").delete().eq("slug", slug);
  });

  it("creates a creator, rejects a duplicate slug, links an account, records snapshots, calculates growth, and produces a profile", async () => {
    const creator = await createCreator(repository, { slug, display_name: "Integration Test Creator" });
    expect(creator.id).toBeTruthy();
    expect(creator.workspace_id).toBeNull();

    await expect(createCreator(repository, { slug, display_name: "Duplicate" })).rejects.toBeInstanceOf(
      DuplicateCreatorSlugError,
    );

    const account = await addPlatformAccount(repository, {
      creator_id: creator.id,
      platform: "instagram",
      profile_url: "https://instagram.com/integration-test",
      username: "integration_test",
    });

    await recordAccountMetricSnapshot(repository, {
      account_id: account.id,
      observed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      followers_count: 10_000,
    });
    await recordAccountMetricSnapshot(repository, {
      account_id: account.id,
      observed_at: new Date().toISOString(),
      followers_count: 12_000,
    });

    const growth = await calculateGrowthMetricsUseCase(repository, {
      account_id: account.id,
      window: "30d",
    });
    expect(growth.follower_growth_absolute).toBe(2_000);

    const profile = await getCreatorProfile(repository, { creator_id: creator.id });
    expect(profile.accounts).toHaveLength(1);
    expect(profile.latestSnapshotByAccount[account.id]?.followers_count).toBe(12_000);
    expect(profile.matchingReadiness).toBe("READY");
  });
});
