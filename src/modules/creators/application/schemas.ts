/**
 * Zod input schemas for every Creator use case (SDD §30, domain-architecture.md:
 * HTTP -> Validation (Zod) -> Application Use Case -> Domain -> Repository).
 * Validation happens here, at the application boundary — never inline in a
 * Server Action or route handler.
 */
import { z } from "zod";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCreatorSchema = z.object({
  slug: z.string().min(2).max(80).regex(SLUG_REGEX, "use lowercase letters, numbers and single hyphens"),
  display_name: z.string().min(1).max(200),
  workspace_id: z.string().uuid().nullable().optional(),
  stage_name: z.string().max(200).nullable().optional(),
  creator_type: z.enum(["individual", "duo", "group", "company", "virtual"]).optional(),
  primary_market: z.string().max(100).nullable().optional(),
  timezone: z.string().max(100).nullable().optional(),
});
export type CreateCreatorSchema = z.infer<typeof createCreatorSchema>;

export const addPlatformAccountSchema = z.object({
  creator_id: z.string().uuid(),
  platform: z.enum([
    "instagram", "tiktok", "youtube", "linkedin", "twitch", "x",
    "facebook", "pinterest", "newsletter", "podcast", "website", "other",
  ]),
  profile_url: z.string().url(),
  username: z.string().max(200).nullable().optional(),
  external_platform_id: z.string().max(200).nullable().optional(),
  is_primary_account: z.boolean().optional(),
});
export type AddPlatformAccountSchema = z.infer<typeof addPlatformAccountSchema>;

export const recordAccountMetricSnapshotSchema = z.object({
  account_id: z.string().uuid(),
  observed_at: z.string().datetime(),
  followers_count: z.number().int().nonnegative().nullable().optional(),
  following_count: z.number().int().nonnegative().nullable().optional(),
  content_count: z.number().int().nonnegative().nullable().optional(),
  source_id: z.string().uuid().nullable().optional(),
  // z.any() (not z.unknown()) so the inferred type structurally satisfies
  // the generated `Json` column type — see database.types.ts.
  raw_metrics: z.record(z.string(), z.any()).nullable().optional(),
});
export type RecordAccountMetricSnapshotSchema = z.infer<typeof recordAccountMetricSnapshotSchema>;

export const calculateGrowthMetricsSchema = z.object({
  account_id: z.string().uuid(),
  window: z.enum(["7d", "30d", "90d", "365d", "custom"]),
});
export type CalculateGrowthMetricsSchema = z.infer<typeof calculateGrowthMetricsSchema>;

export const getCreatorProfileSchema = z.object({
  creator_id: z.string().uuid(),
});
export type GetCreatorProfileSchema = z.infer<typeof getCreatorProfileSchema>;
