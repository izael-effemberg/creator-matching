import type { CreatorRepository } from "../../domain/creator-repository.port";
import type { PlatformAccount } from "../../domain/platform-account";
import { CreatorNotFoundError } from "../../domain/creator";
import { DuplicatePlatformAccountError } from "../../domain/platform-account";
import { addPlatformAccountSchema, type AddPlatformAccountSchema } from "../schemas";

/**
 * SDD §16 Identity Resolution: this deliberately does NOT attempt fuzzy
 * matching against existing accounts by username/name similarity — only the
 * database's exact (platform, external_platform_id) constraint is relied on
 * (surfaced here as a domain error). Real identity resolution is follow-up
 * work, not silently approximated here.
 */
export async function addPlatformAccount(
  repository: CreatorRepository,
  input: AddPlatformAccountSchema,
): Promise<PlatformAccount> {
  const validated = addPlatformAccountSchema.parse(input);

  const creator = await repository.findById(validated.creator_id);
  if (!creator) {
    throw new CreatorNotFoundError(validated.creator_id);
  }

  try {
    return await repository.addPlatformAccount({
      creator_id: validated.creator_id,
      platform: validated.platform,
      profile_url: validated.profile_url,
      username: validated.username ?? null,
      external_platform_id: validated.external_platform_id ?? null,
      is_primary_account: validated.is_primary_account ?? false,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DuplicatePlatformAccountError(
        validated.platform,
        validated.external_platform_id ?? "(none)",
      );
    }
    throw error;
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}
