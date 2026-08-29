/**
 * Creator — canonical, platform-independent identity.
 * SDD: harness/02-intent/specs/creator/creator-intelligence-database.md §8.1, §6.1-6.2
 *
 * A Creator is NOT a social media account. Instagram/TikTok/YouTube accounts
 * (PlatformAccount, see platform-account.ts) belong to a Creator, never the
 * other way around.
 */
import type { Tables } from "@/platform/supabase/database.types";

export type Creator = Tables<"creators">;

/**
 * A Creator with `workspace_id = null` is globally discovered/canonical and
 * broadly readable. A non-null `workspace_id` scopes it to that workspace.
 * See ADR-011 (Creator ownership model).
 */
export function isGloballyDiscovered(creator: Pick<Creator, "workspace_id">): boolean {
  return creator.workspace_id === null;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class InvalidCreatorSlugError extends Error {
  constructor(slug: string) {
    super(
      `Invalid creator slug "${slug}": must be lowercase alphanumeric segments separated by single hyphens (e.g. "jane-doe").`,
    );
    this.name = "InvalidCreatorSlugError";
  }
}

/** Slugs are the human-readable identifier (SDD §8.1) — validated here, not just at the DB unique-constraint layer, so callers get a clear domain error before hitting Postgres. */
export function assertValidCreatorSlug(slug: string): void {
  if (!SLUG_PATTERN.test(slug)) {
    throw new InvalidCreatorSlugError(slug);
  }
}

export class DuplicateCreatorSlugError extends Error {
  constructor(slug: string) {
    super(`A creator with slug "${slug}" already exists.`);
    this.name = "DuplicateCreatorSlugError";
  }
}

export class CreatorNotFoundError extends Error {
  constructor(id: string) {
    super(`Creator "${id}" was not found.`);
    this.name = "CreatorNotFoundError";
  }
}
