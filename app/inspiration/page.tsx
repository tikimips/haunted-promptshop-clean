// app/inspiration/page.tsx
"use client";
import { useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import PromptGrid, { type Prompt } from "@/components/PromptGrid";
import GeneratePrompt from "@/components/GeneratePrompt";
import { SEED_FEED } from "@/lib/feed";

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  const sortedMine = useMemo(() => {
    const favs = mine
      .filter((p) => p.favorite)
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));
    const rest = mine
      .filter((p) => !p.favorite)
      .slice()
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return [...favs, ...rest];
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <GeneratePrompt onSaved={(p) => setMine((m) => [p, ...m])} />

      <h1 className="mt-10 text-2xl font-bold">Inspiration</h1>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: "all", label: "All" },
            { value: "mine", label: "Prompt Library" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as "all" | "mine")}
        />

        <div className="mt-6">
          {tab === "all" ? (
            <PromptGrid items={SEED_FEED} />
          ) : sortedMine.length ? (
            <PromptGrid items={sortedMine} />
          ) : (
            <p className="py-10 text-center text-neutral-500">
              Nothing saved yet. Go to <b>Inspiration</b> and use <b>Save</b> on any card to add it here.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}