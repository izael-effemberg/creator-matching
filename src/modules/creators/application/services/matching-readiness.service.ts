/**
 * Matching Readiness — SDD §21: "readiness não significa que todos os campos
 * estejam preenchidos. Significa que existe informação suficiente para
 * Matching." Scoped to Phase-1 fields only (SDD §22's full P0 Matching
 * Features list includes categories/topics/positioning/commercial data that
 * don't exist until Phase 3-4 land — this function does not pretend to
 * evaluate those and will need extending, not replacing, when they do).
 */
import type { Creator } from "../../domain/creator";
import type { PlatformAccount } from "../../domain/platform-account";
import type { AccountMetricSnapshot } from "../../domain/metric-snapshot";
import type { CreatorLocation } from "../../domain/creator-repository.port";

export const MATCHING_READINESS_CALCULATION_VERSION = "matching-readiness-v1-phase1";

export type MatchingReadiness = "NOT_READY" | "PARTIALLY_READY" | "READY" | "HIGH_CONFIDENCE";

export interface MatchingReadinessInput {
  creator: Creator;
  accounts: PlatformAccount[];
  latestSnapshotByAccount: Map<string, AccountMetricSnapshot | undefined>;
  locations: CreatorLocation[];
}

export function calculateMatchingReadiness(input: MatchingReadinessInput): MatchingReadiness {
  const hasIdentity = Boolean(input.creator.display_name);
  const hasAccount = input.accounts.length > 0;
  const hasFollowerData = [...input.latestSnapshotByAccount.values()].some(
    (s) => s?.followers_count !== null && s?.followers_count !== undefined,
  );
  const hasLocation = input.locations.length > 0;

  if (!hasIdentity || !hasAccount) {
    return "NOT_READY";
  }
  if (!hasFollowerData) {
    return "PARTIALLY_READY";
  }
  if (!hasLocation) {
    return "READY";
  }
  // "HIGH_CONFIDENCE" is intentionally hard to reach with only Phase-1 data —
  // categories/topics/positioning/commercial signals (Phase 3-4) are what
  // should actually earn it. Phase 1 caps out at READY by design.
  return "READY";
}
