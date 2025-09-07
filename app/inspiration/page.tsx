// app/inspiration/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid from "@/components/PromptGrid";
import GeneratePrompt from "@/components/GeneratePrompt";
import type { Prompt } from "@/app/types";
import { readMine, writeMine, toggleFavorite, overwriteMine } from "@/lib/storage";

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  // boot: load saved prompts
  useEffect(() => {
    setMine(readMine());
  }, []);

  const handleCopy = useCallback(async (p: Prompt) => {
    try {
      await navigator.clipboard.writeText(p.promptText);
    } catch {
      // ignore
    }
  }, []);

  const handleSave = useCallback((p: Prompt) => {
    const updated = writeMine(p);
    setMine(updated);
    setTab("mine");
  }, []);

  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = toggleFavorite(p.id);
    setMine(updated);
  }, []);

  // favorite first (alpha), then others by recency
  const mineSorted = useMemo(() => {
    const favs = mine.filter((m) => m.favorite).sort((a, b) => a.title.localeCompare(b.title));
    const rest = mine
      .filter((m) => !m.favorite)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
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

      {/* Uploader / Generate */}
      <GeneratePrompt onSaved={handleSave} />

      {/* Content */}
      {tab === "all" ? (
        <InfiniteFeed onCopy={handleCopy} onSave={handleSave} onToggleFavorite={handleToggleFavorite} />
      ) : mineSorted.length ? (
        <div className="mt-6">
          <PromptGrid
            items={mineSorted}
            onCopy={handleCopy}
            onSave={handleSave}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Use <b>Save</b> on any card to add it here.
        </p>
      )}
    </main>
  );
}