"use client";

import { useCallback, useEffect, useState } from "react";
import GeneratePrompt from "@/components/GeneratePrompt";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid from "@/components/PromptGrid";
import type { Prompt } from "@/app/types";
import { readMine, writeMine } from "@/lib/storage";
import { loadFeedPage } from "@/lib/feed";
import toast from "react-hot-toast";

// We keep this as a client page to use state + toasts easily.
// We also avoid SSG issues by forcing dynamic at route level in the server file (app/page.tsx).
export default function InspirationPage() {
  const [mine, setMine] = useState<Prompt[]>([]);
  const [tab, setTab] = useState<"all" | "mine">("all");

  useEffect(() => {
    setMine(readMine());
  }, []);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success("Prompt copied"),
      () => toast.error("Copy failed")
    );
  }, []);

  const handleSave = useCallback((p: Prompt) => {
    const updated = writeMine(p);
    setMine(updated);
    toast.success("Saved to library");
  }, []);

  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = writeMine({ ...p, favorite: !p.favorite });
    setMine(updated);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Tabs */}
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

      {/* Generator */}
      <div className="mb-8">
        <GeneratePrompt onSaved={handleSave} />
      </div>

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
          Nothing saved yet. Generate or browse prompts and click <b>Save</b>.
        </p>
      )}
    </main>
  );
}