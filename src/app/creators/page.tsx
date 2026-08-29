import Link from "next/link";
import { listCreatorsAction } from "@/modules/creators";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function CreatorsPage() {
  const { creators, total } = await listCreatorsAction({ limit: PAGE_SIZE, offset: 0 });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold">Creators</h1>
      <p className="text-sm text-muted-foreground mt-1">{total} total</p>

      {creators.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No creators yet. This is Phase 1 of the Creator Intelligence Database — creation
          currently happens server-side (ingestion), there is no self-serve form yet.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border">
          {creators.map((creator) => (
            <li key={creator.id} className="py-3">
              <Link href={`/creators/${creator.id}`} className="font-medium hover:underline">
                {creator.display_name}
              </Link>
              <span className="ml-2 text-sm text-muted-foreground">@{creator.slug}</span>
              <span className="ml-2 text-xs text-muted-foreground">{creator.creator_status}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
