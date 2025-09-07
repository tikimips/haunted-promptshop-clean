"use client";

import { useEffect, useState, useCallback } from "react";
import GeneratePrompt from "@/components/GeneratePrompt";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid from "@/components/PromptGrid";
import { readMine, writeMine } from "@/lib/storage";
import { loadFeedPage } from "@/lib/feed";
import type { Prompt } from "@/app/types";

export default function InspirationPage() {
  const [mine, setMine] = useState<Prompt[]>([]);
  const [tab, setTab] = useState<"all" | "mine">("all");

  // Load saved prompts
  useEffect(() => {
    setMine(readMine());
  }, []);

  // Save a prompt
  const handleSave = useCallback((p: Prompt) => {
    const updated = writeMine(p);
    setMine(updated);
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = mine.map((item) =>
      item.id === p.id ? { ...item, favorite: !item.favorite } : item
    );
    setMine(updated);
    writeMine(updated);
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <h1 className="mb-8 text-3xl font-bold">Inspiration</h1>

      {/* Generate From Image / Notes */}
      <GeneratePrompt onSaved={handleSave} />

      {/* Tabs */}
      <div className="mt-8 flex gap-4 border-b pb-2">
        <button
          className={`pb-2 ${tab === "all" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          onClick={() => setTab("all")}
        >
          All
        </button>
        <button
          className={`pb-2 ${tab === "mine" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          onClick={() => setTab("mine")}
        >
          Prompt Library
        </button>
      </div>

      {/* Content */}
      {tab === "all" ? (
        <InfiniteFeed
          loadPage={loadFeedPage}
          onSave={handleSave}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : mine.length ? (
        <PromptGrid
          items={mine}
          onSave={handleSave}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any card.
        </p>
      )}
    </main>
  );
}