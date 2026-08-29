/**
 * Growth calculation — pure, deterministic, versioned.
 * SDD §8.6, §6.3. Derived strictly from two AccountMetricSnapshots; never
 * mutates or reads a "current" follower count directly.
 *
 * `growth_acceleration` (needs 3+ snapshots) and `content_growth_correlation`
 * (needs Phase 3 content data) are intentionally left null here — computing
 * them from only two points would be misleading, not merely incomplete.
 */
import type { AccountMetricSnapshot } from "./metric-snapshot";
import type { MetricWindow } from "./enums";

/** Bump this whenever the calculation logic changes — persisted alongside every result (SDD §8.6 calculation_version) so past results stay attributable to the formula that produced them. */
export const GROWTH_CALCULATION_VERSION = "growth-calc-v1";

/** Heuristic thresholds — not validated against real data yet, see harness/01-knowledge/product/assumptions.md conventions for how to track this. */
const VIRAL_GROWTH_PCT_THRESHOLD = 20;

export interface GrowthMetricsInput {
  account_id: string;
  window: MetricWindow;
  window_start: string;
  window_end: string;
  follower_growth_absolute: number | null;
  follower_growth_pct: number | null;
  avg_daily_follower_growth: number | null;
  growth_velocity: number | null;
  growth_acceleration: null;
  content_growth_correlation: null;
  viral_growth_flag: boolean;
  audience_decay_flag: boolean;
  calculation_version: string;
}

export function calculateGrowthMetrics(params: {
  accountId: string;
  window: MetricWindow;
  startSnapshot: Pick<AccountMetricSnapshot, "followers_count" | "observed_at">;
  endSnapshot: Pick<AccountMetricSnapshot, "followers_count" | "observed_at">;
}): GrowthMetricsInput {
  const { accountId, window, startSnapshot, endSnapshot } = params;

  const windowStart = new Date(startSnapshot.observed_at);
  const windowEnd = new Date(endSnapshot.observed_at);
  const days = Math.max(
    (windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60 * 24),
    1,
  );

  const start = startSnapshot.followers_count;
  const end = endSnapshot.followers_count;

  const absolute = start !== null && end !== null ? end - start : null;
  const pct = start !== null && end !== null && start > 0 ? (absolute! / start) * 100 : null;
  const avgDaily = absolute !== null ? absolute / days : null;
  // Velocity expressed as %/day — distinct from the absolute avg_daily figure.
  const velocity = pct !== null ? pct / days : null;

  return {
    account_id: accountId,
    window,
    window_start: windowStart.toISOString(),
    window_end: windowEnd.toISOString(),
    follower_growth_absolute: absolute,
    follower_growth_pct: pct,
    avg_daily_follower_growth: avgDaily,
    growth_velocity: velocity,
    growth_acceleration: null,
    content_growth_correlation: null,
    viral_growth_flag: pct !== null && pct >= VIRAL_GROWTH_PCT_THRESHOLD,
    audience_decay_flag: absolute !== null && absolute < 0,
    calculation_version: GROWTH_CALCULATION_VERSION,
  };
}
