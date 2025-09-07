// app/inspiration/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Prompt } from "@/app/types";
import GeneratePrompt from "@/components/GeneratePrompt";
import PromptGrid from "@/components/PromptGrid";
import InfiniteFeed from "@/components/InfiniteFeed";
import toast from "react-hot-toast";

type Tab = "all" | "mine";

export default function InspirationPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("promptshop:mine");
    if (raw) {
      try { setMine(JSON.parse(raw)); } catch {}
    }
  }, []);
  // persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("promptshop:mine", JSON.stringify(mine));
  }, [mine]);

  const onCopy = useCallback((p: Prompt) => {
    toast.success("Prompt copied.");
  }, []);

  const onSave = useCallback((p: Prompt) => {
    setMine((cur) => {
      if (cur.some((x) => x.id === p.id)) return cur; // already saved
      return [{ ...p, createdAt: new Date().toISOString() }, ...cur];
    });
    toast.success("Saved to Prompt Library.");
    setTab("mine");
  }, []);

  const onToggleFavorite = useCallback((p: Prompt) => {
    setMine((cur) =>
      cur.map((x) => (x.id === p.id ? { ...x, favorite: !x.favorite } : x))
    );
  }, []);

  const handleSaved = useCallback((p: Prompt) => {
    // generated item returned from API
    onSave(p);
  }, [onSave]);

  // sort mine: favorites A–Z by title, then others newest first
  const sortedMine = (() => {
    const fav = mine.filter((m) => m.favorite).sort((a, b) => a.title.localeCompare(b.title));
    const rest = mine
      .filter((m) => !m.favorite)
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return [...fav, ...rest];
  })();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <GeneratePrompt onSaved={handleSaved} />

      <h1 className="mt-2 text-2xl font-bold">Inspiration</h1>

      {/* Tabs */}
      <div className="mt-4 flex gap-2">
        <button
          className={`rounded-full px-3 py-1 text-sm ${tab === "all" ? "bg-black text-white" : "bg-neutral-200"}`}
          onClick={() => setTab("all")}
        >All</button>
        <button
          className={`rounded-full px-3 py-1 text-sm ${tab === "mine" ? "bg-black text-white" : "bg-neutral-200"}`}
          onClick={() => setTab("mine")}
        >Prompt Library</button>
      </div>

      <div className="mt-6">
        {tab === "all" ? (
          <InfiniteFeed
            onCopy={onCopy}
            onSave={onSave}
            onToggleFavorite={onToggleFavorite}
          />
        ) : sortedMine.length ? (
          <PromptGrid
            items={sortedMine}
            onCopy={onCopy}
            onSave={onSave}
            onToggleFavorite={onToggleFavorite}
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