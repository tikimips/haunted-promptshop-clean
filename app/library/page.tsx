// app/library/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PromptGrid from "../../components/PromptGrid";
import { Prompt } from "../types";

const STORAGE_KEY = "ps:mine";
function readMine(): Prompt[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function LibraryPage() {
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => {
    setMine(readMine());
    const onFocus = () => setMine(readMine());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const sortedMine = useMemo(() => {
    const fav = mine
      .filter((m) => m.favorite)
      .sort((a, b) => a.name.localeCompare(b.name));
    const rest = mine
      .filter((m) => !m.favorite)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return [...fav, ...rest];
  }, [mine]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Prompt Library</h1>
      {sortedMine.length ? (
        <PromptGrid items={sortedMine} />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any card,
          or generate your first prompt.
        </p>
      )}
    </main>
  );
}