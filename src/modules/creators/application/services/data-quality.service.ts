/**
 * Data Quality / Profile Completeness — SDD §34-35.
 *
 * Completeness = "how much of the expected Phase-1 profile do we have?"
 * Quality = "how much can we trust what we have?"
 * These are different questions and can disagree (SDD §35 example:
 * completeness 92% / quality 58%).
 *
 * IMPORTANT: this formula is explicitly a draft, not the final one (SDD §34
 * "não hardcode fórmula final"). It only considers fields available in
 * Phase 1 (identity, accounts, locations, languages, metric freshness) —
 * extend the weights/inputs here as Phase 2+ tables land, bump
 * CALCULATION_VERSION whenever the formula itself changes.
 */
import type { Creator } from "../../domain/creator";
import type { PlatformAccount } from "../../domain/platform-account";
import type { AccountMetricSnapshot } from "../../domain/metric-snapshot";
import type { CreatorLocation, CreatorLanguage } from "../../domain/creator-repository.port";

export const DATA_QUALITY_CALCULATION_VERSION = "data-quality-v1-phase1";

export interface DataQualityInput {
  creator: Creator;
  accounts: PlatformAccount[];
  latestSnapshotByAccount: Map<string, AccountMetricSnapshot | undefined>;
  locations: CreatorLocation[];
  languages: CreatorLanguage[];
  now?: Date;
}

export interface DataQualityResult {
  profileCompleteness: number;
  dataQualityScore: number;
  calculationVersion: string;
}

const FRESHNESS_STALE_AFTER_DAYS = 30;

export function calculateDataQuality(input: DataQualityInput): DataQualityResult {
  const now = input.now ?? new Date();

  const identityFields = [
    input.creator.display_name,
    input.creator.bio,
    input.creator.headline,
    input.creator.profile_image_url,
  ];
  const identityCompleteness = identityFields.filter((f) => Boolean(f)).length / identityFields.length;

  const hasAccount = input.accounts.length > 0 ? 1 : 0;
  const hasLocation = input.locations.length > 0 ? 1 : 0;
  const hasLanguage = input.languages.length > 0 ? 1 : 0;
  const hasAnyMetric = [...input.latestSnapshotByAccount.values()].some(Boolean) ? 1 : 0;

  const completenessDimensions = [identityCompleteness, hasAccount, hasLocation, hasLanguage, hasAnyMetric];
  const profileCompleteness =
    completenessDimensions.reduce((sum, v) => sum + v, 0) / completenessDimensions.length;

  // Quality: only meaningful once there's something to assess freshness of.
  const freshnessScores = input.accounts.map((account) => {
    const snapshot = input.latestSnapshotByAccount.get(account.id);
    if (!snapshot) return 0;
    const ageDays = (now.getTime() - new Date(snapshot.observed_at).getTime()) / (1000 * 60 * 60 * 24);
    return ageDays <= FRESHNESS_STALE_AFTER_DAYS ? 1 : Math.max(0, 1 - (ageDays - FRESHNESS_STALE_AFTER_DAYS) / 90);
  });
  const metricFreshness =
    freshnessScores.length > 0 ? freshnessScores.reduce((s, v) => s + v, 0) / freshnessScores.length : 0;

  const verifiedSignal = input.creator.is_verified_creator ? 1 : 0.5;

  const dataQualityScore = 0.6 * metricFreshness + 0.4 * verifiedSignal;

  return {
    profileCompleteness: round(profileCompleteness),
    dataQualityScore: round(dataQualityScore),
    calculationVersion: DATA_QUALITY_CALCULATION_VERSION,
  };
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
