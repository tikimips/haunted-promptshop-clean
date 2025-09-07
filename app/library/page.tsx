// app/library/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Prompt } from "@/app/types";
import PromptGrid from "@/components/PromptGrid";
import { readMine, toggleFavorite, writeMine } from "@/lib/storage";

export default function LibraryPage() {
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => {
    setMine(readMine());
  }, []);

  const sorted = useMemo(() => {
    const favs = mine.filter((m) => m.favorite).sort((a, b) => a.title.localeCompare(b.title));
    const rest = mine
      .filter((m) => !m.favorite)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return [...favs, ...rest];
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Prompt Library</h1>
      {sorted.length ? (
        <PromptGrid
          items={sorted}
          onCopy={async (p) => {
            try {
              await navigator.clipboard.writeText(p.promptText);
            } catch {}
          }}
          onSave={(p) => setMine(writeMine(p))}
          onToggleFavorite={(p) => setMine(toggleFavorite(p.id))}
        />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any card.
        </p>
      )}
    </main>
  );
}