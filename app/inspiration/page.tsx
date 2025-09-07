"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs } from "@/components/Tabs";
import InfiniteFeed from "@/components/InfiniteFeed";
import GeneratePrompt from "@/components/GeneratePrompt";
import type { Prompt } from "@/components/PromptGrid";
import { readMine, writeMine } from "@/lib/storage";
import { loadFeedPage } from "@/lib/feed";

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  // hydrate mine from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMine(readMine());
    }
  }, []);

  // save to localStorage
  const handleSave = useCallback((p: Prompt) => {
    const updated = writeMine(p);
    setMine(updated);
  }, []);

  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = writeMine({ ...p, favorite: !p.favorite });
    setMine(updated);
  }, []);

  const handleCopy = useCallback(async (p: Prompt) => {
    await navigator.clipboard.writeText(p.promptText);
    console.log("Copied prompt:", p.promptText);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Page header */}
      <h1 className="mb-6 text-3xl font-bold">Inspiration</h1>

      {/* Generate From Image / Notes */}
      <GeneratePrompt onSaved={handleSave} />

      <Tabs
        tabs={[
          { id: "all", label: "All" },
          { id: "mine", label: "Prompt Library" },
        ]}
        value={tab}
        onChange={(v) => setTab(v as "all" | "mine")}
      />

      <div className="mt-6">
        {tab === "all" ? (
          <InfiniteFeed
            loadPage={loadFeedPage}
            onCopy={handleCopy}
            onSave={handleSave}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : mine.length ? (
          <InfiniteFeed
            loadPage={async () => ({ items: mine, nextCursor: null })}
            onCopy={handleCopy}
            onSave={handleSave}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <p className="py-10 text-center text-neutral-500">
            Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any
            card.
          </p>
        )}
      </div>
    </main>
  );
}