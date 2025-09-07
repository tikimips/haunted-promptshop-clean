// app/inspiration/page.tsx
import { useMemo, useState } from "react";
import Tabs from "@/components/Tabs";
import PromptGrid, { type Prompt } from "@/components/PromptGrid";
import GeneratePrompt from "@/components/GeneratePrompt";
import { SEED_FEED } from "@/lib/feed";

export default function InspirationPage() {
  // which tab is selected
  const [tab, setTab] = useState<"all" | "mine">("all");

  // “mine” = your saved prompts (for now this starts empty until Save is implemented)
  const [mine, setMine] = useState<Prompt[]>([]);

  // sort “mine”: favorites first (A→Z by title), then the rest (newest first)
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
      {/* Generate From Image / Notes (no props; onSaved will be wired next) */}
      <GeneratePrompt />

      <h1 className="mt-10 text-2xl font-bold">Inspiration</h1>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: "all", label: "All" }, // 👈 value+label, not key
            { value: "mine", label: "Prompt Library" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as "all" | "mine")}
        />

        <div className="mt-6">
          {tab === "all" ? (
            // Inspiration grid (seed data for now; external feeds wire-up next)
            <PromptGrid items={SEED_FEED} />
          ) : sortedMine.length ? (
            // Your saved prompts (empty until Save is wired end-to-end)
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