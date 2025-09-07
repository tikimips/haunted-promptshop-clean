"use client";

import { useEffect, useMemo, useState } from "react";
import type { Prompt } from "@/app/types";
import PromptGrid from "@/components/PromptGrid";
import { readMine, toggleFavorite } from "@/lib/storage";

export default function LibraryPage() {
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => { setMine(readMine()); }, []);

  const sorted = useMemo(() => {
    const fav = mine.filter(p => p.favorite).slice().sort((a, b) => a.title.localeCompare(b.title));
    const rest = mine.filter(p => !p.favorite).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return [...fav, ...rest];
  }, [mine]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Prompt Library</h1>
      {sorted.length ? (
        <PromptGrid
          items={sorted}
          onToggleFavorite={(p) => setMine(toggleFavorite(p.id))}
        />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any card.
        </p>
      )}
    </div>
  );
}