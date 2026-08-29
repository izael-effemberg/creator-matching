import type { CreatorRepository } from "../../domain/creator-repository.port";
import type { Creator } from "../../domain/creator";
import { assertValidCreatorSlug, DuplicateCreatorSlugError } from "../../domain/creator";
import { createCreatorSchema, type CreateCreatorSchema } from "../schemas";

export async function createCreator(
  repository: CreatorRepository,
  input: CreateCreatorSchema,
): Promise<Creator> {
  const validated = createCreatorSchema.parse(input);
  assertValidCreatorSlug(validated.slug);

  const existing = await repository.findBySlug(validated.slug);
  if (existing) {
    throw new DuplicateCreatorSlugError(validated.slug);
  }

  return repository.create({
    slug: validated.slug,
    display_name: validated.display_name,
    workspace_id: validated.workspace_id ?? null,
    stage_name: validated.stage_name ?? null,
    creator_type: validated.creator_type ?? "individual",
    primary_market: validated.primary_market ?? null,
    timezone: validated.timezone ?? null,
  });
}
