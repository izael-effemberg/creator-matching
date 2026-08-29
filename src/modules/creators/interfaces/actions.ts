"use server";

/**
 * Next.js Server Actions — thin wrappers over application use cases.
 * domain-architecture.md: "Server Actions podem ser usados quando
 * apropriado, mas não devem se tornar a única interface da aplicação."
 * This is the interface layer; no business logic lives here.
 */
import { getSupabaseServiceRoleClient } from "@/platform/supabase/server-client";
import { SupabaseCreatorRepository } from "../infrastructure/supabase-creator-repository";
import { createCreator } from "../application/use-cases/create-creator";
import { addPlatformAccount } from "../application/use-cases/add-platform-account";
import { recordAccountMetricSnapshot } from "../application/use-cases/record-account-metric-snapshot";
import { calculateGrowthMetricsUseCase } from "../application/use-cases/calculate-growth-metrics";
import { getCreatorProfile, type CreatorProfile } from "../application/use-cases/get-creator-profile";
import type { CreateCreatorSchema, AddPlatformAccountSchema, RecordAccountMetricSnapshotSchema, CalculateGrowthMetricsSchema } from "../application/schemas";
import type { Creator } from "../domain/creator";
import type { PlatformAccount } from "../domain/platform-account";

function repository(): SupabaseCreatorRepository {
  return new SupabaseCreatorRepository(getSupabaseServiceRoleClient());
}

export async function createCreatorAction(input: CreateCreatorSchema): Promise<Creator> {
  return createCreator(repository(), input);
}

export async function addPlatformAccountAction(input: AddPlatformAccountSchema): Promise<PlatformAccount> {
  return addPlatformAccount(repository(), input);
}

export async function recordAccountMetricSnapshotAction(input: RecordAccountMetricSnapshotSchema) {
  return recordAccountMetricSnapshot(repository(), input);
}

export async function calculateGrowthMetricsAction(input: CalculateGrowthMetricsSchema) {
  return calculateGrowthMetricsUseCase(repository(), input);
}

export async function getCreatorProfileAction(creatorId: string): Promise<CreatorProfile> {
  return getCreatorProfile(repository(), { creator_id: creatorId });
}

export async function listCreatorsAction(params: { limit: number; offset: number }) {
  return repository().list(params);
}
