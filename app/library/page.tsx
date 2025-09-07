// app/library/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { Prompt } from "@/app/types";
import PromptGrid from "@/components/PromptGrid";

export default function LibraryPage() {
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("promptshop:mine");
    if (raw) try { setMine(JSON.parse(raw)); } catch {}
  }, []);

  const fav = mine.filter((m) => m.favorite).sort((a, b) => a.title.localeCompare(b.title));
  const rest = mine
    .filter((m) => !m.favorite)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const sorted = [...fav, ...rest];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Prompt Library</h1>
      {sorted.length ? (
        <PromptGrid items={sorted} />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any card.
        </p>
      )}
    </main>
  );
}