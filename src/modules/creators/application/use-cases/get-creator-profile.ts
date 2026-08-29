/**
 * CreatorProfile read model — SDD §51: "Não exigir que UI conheça todas as
 * tabelas... Este é um read model. Não é necessariamente uma tabela."
 * Aggregates across repository calls; the UI depends only on this shape.
 */
import type { CreatorRepository } from "../../domain/creator-repository.port";
import type { Creator } from "../../domain/creator";
import type { PlatformAccount } from "../../domain/platform-account";
import type { AccountMetricSnapshot } from "../../domain/metric-snapshot";
import type { CreatorLocation, CreatorLanguage, GrowthMetricsRow } from "../../domain/creator-repository.port";
import { CreatorNotFoundError } from "../../domain/creator";
import { calculateDataQuality } from "../services/data-quality.service";
import {
  calculateMatchingReadiness,
  type MatchingReadiness,
} from "../services/matching-readiness.service";
import { getCreatorProfileSchema, type GetCreatorProfileSchema } from "../schemas";

export interface CreatorProfile {
  creator: Creator;
  accounts: PlatformAccount[];
  latestSnapshotByAccount: Record<string, AccountMetricSnapshot | undefined>;
  latestGrowthByAccount: Record<string, GrowthMetricsRow | undefined>;
  locations: CreatorLocation[];
  languages: CreatorLanguage[];
  dataQuality: {
    profileCompleteness: number;
    dataQualityScore: number;
    calculationVersion: string;
  };
  matchingReadiness: MatchingReadiness;
}

export async function getCreatorProfile(
  repository: CreatorRepository,
  input: GetCreatorProfileSchema,
): Promise<CreatorProfile> {
  const validated = getCreatorProfileSchema.parse(input);

  const creator = await repository.findById(validated.creator_id);
  if (!creator) {
    throw new CreatorNotFoundError(validated.creator_id);
  }

  const [accounts, locations, languages] = await Promise.all([
    repository.listPlatformAccounts(creator.id),
    repository.listLocations(creator.id),
    repository.listLanguages(creator.id),
  ]);

  const latestSnapshotByAccount = new Map<string, AccountMetricSnapshot | undefined>();
  const latestGrowthByAccount: Record<string, GrowthMetricsRow | undefined> = {};

  await Promise.all(
    accounts.map(async (account) => {
      const [snapshots, growth] = await Promise.all([
        repository.listAccountMetricSnapshots(account.id, { limit: 1 }),
        repository.latestGrowthMetrics(account.id),
      ]);
      latestSnapshotByAccount.set(account.id, snapshots[0]);
      latestGrowthByAccount[account.id] = growth[0];
    }),
  );

  const dataQuality = calculateDataQuality({
    creator,
    accounts,
    latestSnapshotByAccount,
    locations,
    languages,
  });

  const matchingReadiness = calculateMatchingReadiness({
    creator,
    accounts,
    latestSnapshotByAccount,
    locations,
  });

  return {
    creator,
    accounts,
    latestSnapshotByAccount: Object.fromEntries(latestSnapshotByAccount),
    latestGrowthByAccount,
    locations,
    languages,
    dataQuality,
    matchingReadiness,
  };
}
