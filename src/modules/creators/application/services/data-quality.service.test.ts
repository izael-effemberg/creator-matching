import { describe, expect, it } from "vitest";
import { calculateDataQuality } from "./data-quality.service";
import { makeCreator, makePlatformAccount, makeSnapshot, makeLocation, makeLanguage } from "./test-fixtures";

describe("calculateDataQuality", () => {
  it("scores completeness low for a bare creator with nothing else", () => {
    const result = calculateDataQuality({
      creator: makeCreator({ bio: null, headline: null, profile_image_url: null }),
      accounts: [],
      latestSnapshotByAccount: new Map(),
      locations: [],
      languages: [],
    });
    expect(result.profileCompleteness).toBeLessThan(0.3);
    // No metric freshness signal (0) + unverified creator default weight
    // (0.5 * 0.4) = 0.2 — see calculateDataQuality's documented weights.
    expect(result.dataQualityScore).toBeCloseTo(0.2, 5);
  });

  it("scores completeness higher with identity, account, location and language filled in", () => {
    const account = makePlatformAccount();
    const result = calculateDataQuality({
      creator: makeCreator({ bio: "bio", headline: "headline", profile_image_url: "url" }),
      accounts: [account],
      latestSnapshotByAccount: new Map([[account.id, makeSnapshot({ account_id: account.id })]]),
      locations: [makeLocation()],
      languages: [makeLanguage()],
    });
    expect(result.profileCompleteness).toBe(1);
  });

  it("penalizes stale metrics in the quality score", () => {
    const account = makePlatformAccount();
    const now = new Date("2026-06-01T00:00:00.000Z");

    const fresh = calculateDataQuality({
      creator: makeCreator(),
      accounts: [account],
      latestSnapshotByAccount: new Map([
        [account.id, makeSnapshot({ account_id: account.id, observed_at: "2026-05-25T00:00:00.000Z" })],
      ]),
      locations: [],
      languages: [],
      now,
    });

    const stale = calculateDataQuality({
      creator: makeCreator(),
      accounts: [account],
      latestSnapshotByAccount: new Map([
        [account.id, makeSnapshot({ account_id: account.id, observed_at: "2026-01-01T00:00:00.000Z" })],
      ]),
      locations: [],
      languages: [],
      now,
    });

    expect(fresh.dataQualityScore).toBeGreaterThan(stale.dataQualityScore);
  });

  it("is a versioned, non-final calculation (SDD §34)", () => {
    const result = calculateDataQuality({
      creator: makeCreator(),
      accounts: [],
      latestSnapshotByAccount: new Map(),
      locations: [],
      languages: [],
    });
    expect(result.calculationVersion).toMatch(/^data-quality-v\d+/);
  });
});
