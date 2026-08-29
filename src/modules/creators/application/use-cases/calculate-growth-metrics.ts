import type { CreatorRepository, GrowthMetricsRow } from "../../domain/creator-repository.port";
import { PlatformAccountNotFoundError } from "../../domain/platform-account";
import { calculateGrowthMetrics } from "../../domain/growth-metrics";
import type { MetricWindow } from "../../domain/enums";
import {
  calculateGrowthMetricsSchema,
  type CalculateGrowthMetricsSchema,
} from "../schemas";

const WINDOW_DAYS: Record<Exclude<MetricWindow, "custom">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};

export class InsufficientSnapshotsError extends Error {
  constructor(accountId: string) {
    super(
      `Account "${accountId}" needs at least two metric snapshots spanning the requested window to calculate growth.`,
    );
    this.name = "InsufficientSnapshotsError";
  }
}

export class UnsupportedWindowError extends Error {
  constructor() {
    super('"custom" windows are not supported yet — no explicit start/end date input exists for this use case.');
    this.name = "UnsupportedWindowError";
  }
}

/**
 * Finds the two snapshots bounding `window` and derives growth from them
 * (domain/growth-metrics.ts). Fetches recent snapshots and does the
 * windowing in-memory — acceptable at Phase 1 volume (SDD §44: no need to
 * optimize for scale prematurely); revisit if an account accumulates a very
 * large snapshot history.
 */
export async function calculateGrowthMetricsUseCase(
  repository: CreatorRepository,
  input: CalculateGrowthMetricsSchema,
): Promise<GrowthMetricsRow> {
  const validated = calculateGrowthMetricsSchema.parse(input);

  if (validated.window === "custom") {
    throw new UnsupportedWindowError();
  }

  const account = await repository.findPlatformAccountById(validated.account_id);
  if (!account) {
    throw new PlatformAccountNotFoundError(validated.account_id);
  }

  const snapshots = await repository.listAccountMetricSnapshots(validated.account_id, {
    limit: 500,
  });
  if (snapshots.length < 2) {
    throw new InsufficientSnapshotsError(validated.account_id);
  }

  // Repository contract returns snapshots ordered by observed_at desc.
  const endSnapshot = snapshots[0];
  const windowDays = WINDOW_DAYS[validated.window];
  const cutoff = new Date(endSnapshot.observed_at).getTime() - windowDays * 24 * 60 * 60 * 1000;

  const startSnapshot =
    snapshots.find((s) => new Date(s.observed_at).getTime() <= cutoff) ??
    snapshots[snapshots.length - 1];

  if (startSnapshot.id === endSnapshot.id) {
    throw new InsufficientSnapshotsError(validated.account_id);
  }

  const result = calculateGrowthMetrics({
    accountId: validated.account_id,
    window: validated.window,
    startSnapshot,
    endSnapshot,
  });

  return repository.saveGrowthMetrics(result);
}
