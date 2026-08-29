import { describe, expect, it } from "vitest";
import { assertValidCreatorSlug, isGloballyDiscovered, InvalidCreatorSlugError } from "./creator";

describe("assertValidCreatorSlug", () => {
  it.each(["jane-doe", "jane", "jane-doe-2"])("accepts %s", (slug) => {
    expect(() => assertValidCreatorSlug(slug)).not.toThrow();
  });

  it.each(["Jane-Doe", "jane_doe", "jane doe", "-jane", "jane-", "jane--doe", ""])(
    "rejects %s",
    (slug) => {
      expect(() => assertValidCreatorSlug(slug)).toThrow(InvalidCreatorSlugError);
    },
  );
});

describe("isGloballyDiscovered", () => {
  it("is true when workspace_id is null", () => {
    expect(isGloballyDiscovered({ workspace_id: null })).toBe(true);
  });

  it("is false when workspace_id is set", () => {
    expect(isGloballyDiscovered({ workspace_id: "workspace-1" })).toBe(false);
  });
});
