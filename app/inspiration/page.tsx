"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Prompt } from "@/app/types";
import { readMine, writeMine, toggleFavorite } from "@/lib/storage";
import { loadFeedPage } from "@/lib/feed";
import PromptGrid from "@/components/PromptGrid";
import GeneratePrompt from "@/components/GeneratePrompt";
import InfiniteFeed from "@/components/InfiniteFeed";

export default function InspirationPage() {
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => { setMine(readMine()); }, []);

  const handleSaved = useCallback((p: Prompt) => {
    const updated = writeMine(p);
    setMine(updated);
    toast.success("Saved to Prompt Library");
  }, []);

  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = toggleFavorite(p.id);
    setMine(updated);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <GeneratePrompt onSaved={handleSaved} />

      <h1 className="mt-10 text-2xl font-bold">Inspiration</h1>
      <p className="mb-4 text-sm text-neutral-600">Hover any tile to Copy / Save / Favorite. Infinite scroll loads more.</p>

      <InfiniteFeed
        loadPage={loadFeedPage}
        onSave={handleSaved}
        onToggleFavorite={handleToggleFavorite}
      />

      {mine.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold">Recently Saved</h2>
          <PromptGrid
            items={mine}
            onSave={handleSaved}
            onToggleFavorite={handleToggleFavorite}
          />
        </>
      )}
    </div>
  );
}