import type { CreatorRepository } from "../../domain/creator-repository.port";
import type { AccountMetricSnapshot } from "../../domain/metric-snapshot";
import { PlatformAccountNotFoundError } from "../../domain/platform-account";
import {
  recordAccountMetricSnapshotSchema,
  type RecordAccountMetricSnapshotSchema,
} from "../schemas";

/** SDD §6.3: always inserts a new snapshot, never updates an existing one. */
export async function recordAccountMetricSnapshot(
  repository: CreatorRepository,
  input: RecordAccountMetricSnapshotSchema,
): Promise<AccountMetricSnapshot> {
  const validated = recordAccountMetricSnapshotSchema.parse(input);

  const account = await repository.findPlatformAccountById(validated.account_id);
  if (!account) {
    throw new PlatformAccountNotFoundError(validated.account_id);
  }

  return repository.recordAccountMetricSnapshot({
    account_id: validated.account_id,
    observed_at: validated.observed_at,
    followers_count: validated.followers_count ?? null,
    following_count: validated.following_count ?? null,
    content_count: validated.content_count ?? null,
    source_id: validated.source_id ?? null,
    raw_metrics: validated.raw_metrics ?? null,
  });
}
