import { describe, expect, it } from "vitest";
import { calculateMatchingReadiness } from "./matching-readiness.service";
import { makeCreator, makePlatformAccount, makeSnapshot, makeLocation } from "./test-fixtures";

describe("calculateMatchingReadiness", () => {
  it("is NOT_READY with no platform accounts", () => {
    const result = calculateMatchingReadiness({
      creator: makeCreator(),
      accounts: [],
      latestSnapshotByAccount: new Map(),
      locations: [],
    });
    expect(result).toBe("NOT_READY");
  });

  it("is NOT_READY with no display name", () => {
    const result = calculateMatchingReadiness({
      creator: makeCreator({ display_name: "" }),
      accounts: [makePlatformAccount()],
      latestSnapshotByAccount: new Map(),
      locations: [],
    });
    expect(result).toBe("NOT_READY");
  });

  it("is PARTIALLY_READY with an account but no follower data", () => {
    const account = makePlatformAccount();
    const result = calculateMatchingReadiness({
      creator: makeCreator(),
      accounts: [account],
      latestSnapshotByAccount: new Map([[account.id, undefined]]),
      locations: [],
    });
    expect(result).toBe("PARTIALLY_READY");
  });

  it("is READY with identity, account, followers and location", () => {
    const account = makePlatformAccount();
    const result = calculateMatchingReadiness({
      creator: makeCreator(),
      accounts: [account],
      latestSnapshotByAccount: new Map([[account.id, makeSnapshot({ account_id: account.id })]]),
      locations: [makeLocation()],
    });
    expect(result).toBe("READY");
  });

  it("does not reach HIGH_CONFIDENCE from Phase-1 fields alone", () => {
    const account = makePlatformAccount();
    const result = calculateMatchingReadiness({
      creator: makeCreator({ is_verified_creator: true }),
      accounts: [account],
      latestSnapshotByAccount: new Map([[account.id, makeSnapshot({ account_id: account.id })]]),
      locations: [makeLocation()],
    });
    expect(result).not.toBe("HIGH_CONFIDENCE");
  });
});
