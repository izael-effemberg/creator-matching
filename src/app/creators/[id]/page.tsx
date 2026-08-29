import { notFound } from "next/navigation";
import { getCreatorProfileAction } from "@/modules/creators";
import { CreatorNotFoundError } from "@/modules/creators/domain/creator";

export const dynamic = "force-dynamic";

/**
 * Overview tab only (SDD §50) — Audience/Content/Performance/Positioning/
 * Brands/Commercial/Assets/Intelligence/Data Sources tabs (SDD §49) are
 * later-phase tables and intentionally not stubbed here.
 */
export default async function CreatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let profile;
  try {
    profile = await getCreatorProfileAction(id);
  } catch (error) {
    if (error instanceof CreatorNotFoundError) {
      notFound();
    }
    throw error;
  }

  const { creator, accounts, latestSnapshotByAccount, locations, languages, dataQuality, matchingReadiness } =
    profile;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">{creator.display_name}</h1>
      <p className="text-sm text-muted-foreground">
        @{creator.slug} · {creator.creator_status}
        {creator.workspace_id ? " · workspace-scoped" : " · globally discovered"}
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">Platforms</h2>
        {accounts.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No platform accounts linked yet.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {accounts.map((account) => {
              const snapshot = latestSnapshotByAccount[account.id];
              return (
                <li key={account.id} className="text-sm">
                  <span className="font-medium">{account.platform}</span>
                  {account.username ? ` @${account.username}` : ""} —{" "}
                  {snapshot?.followers_count?.toLocaleString() ?? "no metrics yet"} followers
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">Locations & Languages</h2>
        <p className="mt-2 text-sm">
          {locations.length > 0
            ? locations.map((l) => l.city ?? l.country_code).filter(Boolean).join(", ")
            : "No location data yet."}
        </p>
        <p className="text-sm">
          {languages.length > 0
            ? languages.map((l) => l.language_code).join(", ")
            : "No language data yet."}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">Intelligence (Phase 1, partial)</h2>
        <p className="mt-2 text-sm">
          Matching readiness: <span className="font-medium">{matchingReadiness}</span>
        </p>
        <p className="text-sm">
          Profile completeness: {(dataQuality.profileCompleteness * 100).toFixed(0)}% · Data quality:{" "}
          {(dataQuality.dataQualityScore * 100).toFixed(0)}%{" "}
          <span className="text-xs text-muted-foreground">({dataQuality.calculationVersion})</span>
        </p>
      </section>
    </main>
  );
}
