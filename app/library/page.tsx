// app/library/page.tsx
import PromptGrid, { type Prompt } from "@/components/PromptGrid";

function readMine(): Prompt[] {
  try {
    const raw = typeof window === "undefined" ? null : localStorage.getItem("promptshop:mine");
    const list = raw ? (JSON.parse(raw) as any[]) : [];
    // Normalize to ensure required fields are present
    return list.map((p, i) => {
      const createdAt =
        typeof p?.createdAt === "string" && p.createdAt.trim()
          ? p.createdAt
          : new Date().toISOString();
      return {
        id: String(p?.id ?? `mine-${i}`),
        title: String(p?.title ?? "Untitled"),
        author: String(p?.author ?? "You"),
        imageUrl:
          typeof p?.imageUrl === "string" && p.imageUrl
            ? p.imageUrl
            : "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
        description: String(p?.description ?? ""),
        favorite: Boolean(p?.favorite),
        createdAt,
        prompt: typeof p?.prompt === "string" ? p.prompt : undefined,
      } satisfies Prompt;
    });
  } catch {
    return [];
  }
}

export default function LibraryPage() {
  // At build time (SSR) there’s no localStorage — render empty,
  // the client will hydrate with correct data.
  let mine: Prompt[] = [];
  if (typeof window !== "undefined") {
    mine = readMine();
  }

  // Default sort: favorites first (A–Z by title), then the rest (newest first)
  const sortedMine = [...mine].sort((a, b) => {
    const af = a.favorite ? 0 : 1;
    const bf = b.favorite ? 0 : 1;
    if (af !== bf) return af - bf;
    if (a.favorite && b.favorite) {
      return a.title.localeCompare(b.title);
    }
    // newest first for non-favorites
    return (b.createdAt || "").localeCompare(a.createdAt || "");
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Prompt Library</h1>

      {sortedMine.length ? (
        <PromptGrid items={sortedMine} />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any card.
        </p>
      )}
    </main>
  );
}