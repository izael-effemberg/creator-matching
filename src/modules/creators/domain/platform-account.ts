/**
 * PlatformAccount — a social/owned-media account belonging to a Creator.
 * SDD §8.4, §6.1 (Instagram/TikTok/etc. are data sources, not the domain).
 */
import type { Tables } from "@/platform/supabase/database.types";

export type PlatformAccount = Tables<"creator_platform_accounts">;

export class DuplicatePlatformAccountError extends Error {
  constructor(platform: string, externalPlatformId: string) {
    super(
      `A platform account for "${platform}" with external id "${externalPlatformId}" already exists (linked to another creator, per SDD §16 — do not merge automatically).`,
    );
    this.name = "DuplicatePlatformAccountError";
  }
}

export class PlatformAccountNotFoundError extends Error {
  constructor(id: string) {
    super(`Platform account "${id}" was not found.`);
    this.name = "PlatformAccountNotFoundError";
  }
}
