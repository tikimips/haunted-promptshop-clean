"use client";

import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import GeneratePrompt from "@/components/GeneratePrompt";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid from "@/components/PromptGrid";

import type { Prompt } from "@/app/types";
import { readMine, writeMine, toggleFavorite } from "@/lib/storage";
import { loadFeedPage } from "@/lib/feed";

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  // Load saved prompts from localStorage on mount
  useEffect(() => {
    try {
      setMine(readMine());
    } catch {
      setMine([]);
    }
  }, []);

  // Handlers used by both InfiniteFeed and PromptGrid
  const handleCopy = useCallback((text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  }, []);

  const handleSave = useCallback((p: Prompt) => {
    const updated = writeMine(p);
    setMine(updated);
    toast.success("Saved to your library");
  }, []);

  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = toggleFavorite(p.id);
    setMine(updated);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Fix: Toaster has no containerId prop */}
      <Toaster />

      {/* Simple header + generate box */}
      <div className="mb-6 flex items-center gap-2">
        <button
          className={`rounded-md border px-3 py-1.5 text-sm ${
            tab === "all" ? "bg-black text-white" : "hover:bg-neutral-50"
          }`}
          onClick={() => setTab("all")}
        >
          All
        </button>
        <button
          className={`rounded-md border px-3 py-1.5 text-sm ${
            tab === "mine" ? "bg-black text-white" : "hover:bg-neutral-50"
          }`}
          onClick={() => setTab("mine")}
        >
          Prompt Library
        </button>
      </div>

      {/* Generate From Image / Notes */}
      <GeneratePrompt onSaved={handleSave} />

      <h1 className="mt-8 text-2xl font-bold">Inspiration</h1>

      {/* Content */}
      {tab === "all" ? (
        <InfiniteFeed
          loadPage={loadFeedPage}
          onCopy={handleCopy}
          onSave={handleSave}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : mine.length ? (
        <PromptGrid
          items={mine}
          onCopy={handleCopy}
          onSave={handleSave}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any
          card to add it to your library.
        </p>
      )}
    </main>
  );
}