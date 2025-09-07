// app/inspiration/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid from "@/components/PromptGrid";
import type { Prompt } from "@/app/types";
import { readMine, writeMine, writeMineAll } from "@/lib/storage";

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => {
    setMine(readMine());
  }, []);

  const handleCopy = useCallback((p: Prompt) => {
    navigator.clipboard.writeText(p.promptText).catch(() => {});
  }, []);

  const handleSave = useCallback((p: Prompt) => {
    const updated = writeMine(p);
    setMine(updated);
  }, []);

  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = mine.map(it =>
      it.id === p.id ? { ...it, favorite: !it.favorite } : it
    );
    setMine(updated);
    writeMineAll(updated);
  }, [mine]);

  const sortedMine = useMemo(() => {
    const favs = mine.filter(m => m.favorite).sort((a, b) => a.title.localeCompare(b.title));
    const rest = mine.filter(m => !m.favorite);
    return [...favs, ...rest];
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Inspiration</h1>

      <Tabs
        tabs={[
          { value: "all", label: "All" },
          { value: "mine", label: "Prompt Library" },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        {tab === "all" ? (
          <InfiniteFeed
            onCopy={handleCopy}
            onSave={handleSave}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : sortedMine.length ? (
          <PromptGrid
            items={sortedMine}
            onCopy={handleCopy}
            onSave={handleSave}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <p className="py-10 text-center text-neutral-500">
            Nothing saved yet. Use <b>Save</b> on any card to add it here.
          </p>
        )}
      </div>
    </main>
  );
}