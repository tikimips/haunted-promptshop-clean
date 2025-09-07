"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import GeneratePrompt from "@/components/GeneratePrompt";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid from "@/components/PromptGrid";
import { Tabs } from "@/components/Tabs";
import type { Prompt } from "@/app/types";
import { readMine, writeMine, toggleFavorite } from "@/lib/storage";
import { loadFeedPage } from "@/lib/feed";

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => setMine(readMine()), []);

  const handleSaved = useCallback((p: Prompt) => {
    setMine(writeMine(p));
  }, []);

  const handleSave = useCallback((p: Prompt) => {
    setMine(writeMine(p));
  }, []);

  const handleToggleFavorite = useCallback((p: Prompt) => {
    setMine(toggleFavorite(p.id));
  }, []);

  const sortedMine = useMemo(() => {
    // Favorites first (alphabetical by title), then the rest (newest first)
    const favs = mine.filter((p) => p.favorite).sort((a, b) => a.title.localeCompare(b.title));
    const rest = mine.filter((p) => !p.favorite).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return [...favs, ...rest];
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Inspiration</h1>
        <Tabs
          tabs={[
            { value: "all", label: "All" },
            { value: "mine", label: "Prompt Library" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as "all" | "mine")}
        />
      </div>

      {/* Generate */}
      <div className="mt-6">
        <GeneratePrompt onSaved={handleSaved} />
      </div>

      {/* Content */}
      <div className="mt-10">
        {tab === "all" ? (
          <InfiniteFeed
            loadPage={loadFeedPage}
            onSave={handleSave}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : sortedMine.length ? (
          <PromptGrid
            items={sortedMine}
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