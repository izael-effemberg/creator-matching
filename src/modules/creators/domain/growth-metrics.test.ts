import { describe, expect, it } from "vitest";
import { calculateGrowthMetrics, GROWTH_CALCULATION_VERSION } from "./growth-metrics";

describe("calculateGrowthMetrics", () => {
  it("derives absolute, pct, avg daily and velocity growth over a 30-day window", () => {
    const result = calculateGrowthMetrics({
      accountId: "account-1",
      window: "30d",
      startSnapshot: { followers_count: 100_000, observed_at: "2026-01-01T00:00:00.000Z" },
      endSnapshot: { followers_count: 130_000, observed_at: "2026-01-31T00:00:00.000Z" },
    });

    expect(result.follower_growth_absolute).toBe(30_000);
    expect(result.follower_growth_pct).toBeCloseTo(30, 5);
    expect(result.avg_daily_follower_growth).toBeCloseTo(1_000, 5);
    expect(result.growth_velocity).toBeCloseTo(1, 5);
    expect(result.calculation_version).toBe(GROWTH_CALCULATION_VERSION);
  });

  it("flags audience decay when followers dropped", () => {
    const result = calculateGrowthMetrics({
      accountId: "account-1",
      window: "7d",
      startSnapshot: { followers_count: 50_000, observed_at: "2026-01-01T00:00:00.000Z" },
      endSnapshot: { followers_count: 48_000, observed_at: "2026-01-08T00:00:00.000Z" },
    });

    expect(result.follower_growth_absolute).toBe(-2_000);
    expect(result.audience_decay_flag).toBe(true);
    expect(result.viral_growth_flag).toBe(false);
  });

  it("flags viral growth above the documented threshold", () => {
    const result = calculateGrowthMetrics({
      accountId: "account-1",
      window: "7d",
      startSnapshot: { followers_count: 10_000, observed_at: "2026-01-01T00:00:00.000Z" },
      endSnapshot: { followers_count: 13_000, observed_at: "2026-01-08T00:00:00.000Z" },
    });

    expect(result.follower_growth_pct).toBeCloseTo(30, 5);
    expect(result.viral_growth_flag).toBe(true);
  });

  it("returns null derived figures when a snapshot has no follower count", () => {
    const result = calculateGrowthMetrics({
      accountId: "account-1",
      window: "30d",
      startSnapshot: { followers_count: null, observed_at: "2026-01-01T00:00:00.000Z" },
      endSnapshot: { followers_count: 130_000, observed_at: "2026-01-31T00:00:00.000Z" },
    });

    expect(result.follower_growth_absolute).toBeNull();
    expect(result.follower_growth_pct).toBeNull();
    expect(result.audience_decay_flag).toBe(false);
  });

  it("never computes acceleration or content correlation from two points", () => {
    const result = calculateGrowthMetrics({
      accountId: "account-1",
      window: "30d",
      startSnapshot: { followers_count: 100, observed_at: "2026-01-01T00:00:00.000Z" },
      endSnapshot: { followers_count: 110, observed_at: "2026-01-31T00:00:00.000Z" },
    });

    expect(result.growth_acceleration).toBeNull();
    expect(result.content_growth_correlation).toBeNull();
  });
});
