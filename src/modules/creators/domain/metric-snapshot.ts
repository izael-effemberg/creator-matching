/**
 * AccountMetricSnapshot — an immutable, point-in-time observation.
 * SDD §6.3 (Historical Data First): never overwrite `followers_count` etc.,
 * always append a new snapshot. Growth is derived from these, never stored
 * as a mutable running total — see growth-metrics.ts.
 */
import type { Tables } from "@/platform/supabase/database.types";

export type AccountMetricSnapshot = Tables<"creator_account_metric_snapshots">;
