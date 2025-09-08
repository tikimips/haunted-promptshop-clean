// app/inspiration/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid from "@/components/PromptGrid";
import { type Prompt } from "@/app/types";
import GeneratePrompt from "@/components/GeneratePrompt";
import { readMine, writeMine, toggleFavorite } from "@/lib/storage";
import { loadFeedPage } from "@/lib/feed";

type Tab = "all" | "mine";

export default function InspirationPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => setMine(readMine()), []);

  const handleSave = useCallback((p: Prompt) => setMine(writeMine(p)), []);
  const handleToggleFavorite = useCallback(
    (p: Prompt) => setMine(toggleFavorite(p.id)),
    []
  );

  const content =
    tab === "all" ? (
      <InfiniteFeed
        loadPage={loadFeedPage}
        onCopy={(txt) => navigator.clipboard.writeText(txt)}
        onSave={handleSave}
        onToggleFavorite={handleToggleFavorite}
      />
    ) : mine.length ? (
      <PromptGrid items={mine} />
    ) : (
      <p className="py-10 text-center text-neutral-500">
        Nothing saved yet. Generate something and hit <b>Save</b>.
      </p>
    );

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Inspiration</h1>

      <GeneratePrompt onSaved={handleSave} />

      <div className="mb-4 mt-6 flex items-center gap-2">
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

      {content}
    </main>
  );
}