// app/library/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PromptGrid from "@/components/PromptGrid";
import type { Prompt } from "@/app/types";
import { readMine, writeMineAll } from "@/lib/storage";

export default function LibraryPage() {
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => setMine(readMine()), []);

  const sorted = useMemo(() => {
    const favs = mine.filter(m => m.favorite).sort((a, b) => a.title.localeCompare(b.title));
    const rest = mine.filter(m => !m.favorite);
    return [...favs, ...rest];
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Prompt Library</h1>
      {sorted.length ? (
        <PromptGrid
          items={sorted}
          onToggleFavorite={(p) => {
            const updated = mine.map(it =>
              it.id === p.id ? { ...it, favorite: !it.favorite } : it
            );
            setMine(updated);
            writeMineAll(updated);
          }}
        />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any card.
        </p>
      )}
    </main>
  );
}