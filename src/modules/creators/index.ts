/**
 * Public surface of the creators module. Code outside this module should
 * import from here, not reach into domain/application/infrastructure
 * directly — keeps the module boundary (domain-architecture.md) enforceable.
 */
export type { Creator } from "./domain/creator";
export type { PlatformAccount } from "./domain/platform-account";
export type { AccountMetricSnapshot } from "./domain/metric-snapshot";
export type { MatchingReadiness } from "./application/services/matching-readiness.service";
export type { CreatorProfile } from "./application/use-cases/get-creator-profile";

export {
  createCreatorAction,
  addPlatformAccountAction,
  recordAccountMetricSnapshotAction,
  calculateGrowthMetricsAction,
  getCreatorProfileAction,
  listCreatorsAction,
} from "./interfaces/actions";
