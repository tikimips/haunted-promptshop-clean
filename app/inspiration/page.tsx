// app/inspiration/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import PromptGrid from "@/components/PromptGrid";
import GeneratePrompt from "@/components/GeneratePrompt";
import type { Prompt } from "@/app/types";
import { SEED_FEED } from "@/lib/feed";
import toast from "react-hot-toast";

const LS_KEY = "my-prompts";

function readMine(): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Prompt[];
    // Defensive normalize
    return arr.map((p) => ({
      id: p.id ?? crypto.randomUUID(),
      title: p.title ?? "Untitled",
      author: p.author ?? "You",
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "/placeholder.png",
      favorite: Boolean(p.favorite),
      createdAt: p.createdAt ?? new Date().toISOString(),
      promptText: typeof p.promptText === "string" ? p.promptText : "",
    }));
  } catch {
    return [];
  }
}

function writeMine(list: Prompt[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    setMine(readMine());
  }, []);

  // sorting for Prompt Library:
  // favorites first (A→Z by title), then the rest (newest first)
  const sortedMine = useMemo(() => {
    const arr = [...mine];
    arr.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      if (a.favorite && b.favorite) {
        return a.title.localeCompare(b.title);
      }
      // newest first for non-favorites
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
    return arr;
  }, [mine]);

  // ===== Callbacks passed to PromptGrid =====

  // PromptGrid expects onCopy(text: string)
  const handleCopy = useCallback((text: string) => {
    if (!text) {
      toast.error("No prompt text to copy.");
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Prompt copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  }, []);

  // onSave receives a full Prompt object (from card buttons or generator)
  const handleSave = useCallback((p: Prompt) => {
    setMine((prev) => {
      const next = [p, ...prev.filter((x) => x.id !== p.id)];
      writeMine(next);
      return next;
    });
    toast.success("Saved to Prompt Library");
    setTab("mine");
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setMine((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      );
      writeMine(next);
      return next;
    });
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Generate From Image / Notes */}
      <GeneratePrompt onSaved={handleSave} />

      <h1 className="mt-10 text-2xl font-bold">Inspiration</h1>

      <div className="mt-4 flex items-center gap-4">
        <Tabs
          tabs={[
            { key: "all", label: "All" },
            { key: "mine", label: "Prompt Library" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as "all" | "mine")}
        />
      </div>

      <div className="mt-6">
        {tab === "all" ? (
          <PromptGrid
            items={SEED_FEED}
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
            Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on
            any card.
          </p>
        )}
      </div>
    </main>
  );
}