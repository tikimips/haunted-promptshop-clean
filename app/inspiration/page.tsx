// app/inspiration/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PromptGrid, { Prompt } from "@/components/PromptGrid";
import GeneratePrompt from "@/components/GeneratePrompt";
import Tabs from "@/components/Tabs";

// ---- A small seed feed so “All” always has imagery ----
const SEED_FEED: Prompt[] = [
  {
    id: "seed-1",
    title: "Isometric dashboard",
    author: "Unsplash",
    imageUrl:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1600&auto=format&fit=crop",
    description:
      "Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.",
    favorite: false,
    createdAt: new Date().toISOString(),
    prompt:
      "Sleek isometric analytics dashboard UI, glassmorphism, soft shadows, monochrome palette.",
  },
  {
    id: "seed-2",
    title: "Flat icon set",
    author: "Unsplash",
    imageUrl:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
    description:
      "Create 24 flat icons for a productivity app (outline + filled variants).",
    favorite: false,
    createdAt: new Date().toISOString(),
    prompt:
      "24 flat icons for a productivity app, outline + filled variants, consistent stroke weight.",
  },
  {
    id: "seed-3",
    title: "Moody food photography",
    author: "Unsplash",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    description:
      "Dark, moody food shot with soft light and shallow depth of field.",
    favorite: false,
    createdAt: new Date().toISOString(),
    prompt:
      "Moody food photography, soft directional light, shallow DOF, rich textures, dark backdrop.",
  },
  {
    id: "seed-4",
    title: "Tech macro",
    author: "Unsplash",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    description:
      "Abstract PCB macro with shallow depth and bokeh highlights for hero background.",
    favorite: false,
    createdAt: new Date().toISOString(),
    prompt:
      "Macro shot of PCB, abstract composition, shallow depth, bokeh highlights, cool tones.",
  },
  {
    id: "seed-5",
    title: "Minimal product render",
    author: "Unsplash",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    description:
      "Monochrome product-on-plinth hero with soft shadows and clean gradients.",
    favorite: false,
    createdAt: new Date().toISOString(),
    prompt:
      "Monochrome product render on plinth, soft shadows, clean gradients, editorial lighting.",
  },
  {
    id: "seed-6",
    title: "Futuristic UI",
    author: "Unsplash",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    description:
      "Futuristic heads-up display elements for sci-fi dashboard concept.",
    favorite: false,
    createdAt: new Date().toISOString(),
    prompt:
      "Futuristic HUD UI kit, thin lines, subtle glow, modular panels, sci-fi dashboard concept.",
  },
];

// LocalStorage helpers
const LS_KEY = "promptshop:mine";

function readMine(): Prompt[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<Prompt>[];
    // normalize & coerce
    return parsed.map((p, i) => ({
      id: String(p.id ?? `mine-${i}`),
      title: String(p.title ?? "Untitled"),
      author: String(p.author ?? "You"),
      imageUrl: String(p.imageUrl ?? ""),
      description: String(p.description ?? ""),
      favorite: Boolean(p.favorite),
      createdAt: String(p.createdAt ?? new Date().toISOString()),
      prompt: String(p.prompt ?? ""),
    }));
  } catch {
    return [];
  }
}

function writeMine(items: Prompt[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");

  // “Mine” (Prompt Library)
  const [mine, setMine] = useState<Prompt[]>([]);
  useEffect(() => {
    setMine(readMine());
  }, []);

  // Allow GeneratePrompt to save new entries here
  const handleSaved = (p: Prompt) => {
    setMine((prev) => {
      const next = [p, ...prev];
      writeMine(next);
      return next;
    });
    setTab("mine");
  };

  // Sorted “Mine”: favorites first (alpha by title), then newest
  const sortedMine = useMemo(() => {
    const favs = mine.filter((m) => m.favorite).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    const nonFavs = mine
      .filter((m) => !m.favorite)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return [...favs, ...nonFavs];
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Generate From Image / Notes */}
      <GeneratePrompt onSaved={handleSaved} />

      <h1 className="mt-10 text-2xl font-bold">Inspiration</h1>

      <div className="mt-4">
        <Tabs
          tabs={[
            { id: "all", label: "All" },
            { id: "mine", label: "Prompt Library" },
          ]}
          value={tab}
          onChange={(id) => setTab(id as "all" | "mine")}
        />

        <div className="mt-6">
          {tab === "all" ? (
            <PromptGrid prompts={SEED_FEED} />
          ) : sortedMine.length ? (
            <PromptGrid prompts={sortedMine} />
          ) : (
            <p className="py-10 text-center text-neutral-500">
              Nothing saved yet. Use <b>Save</b> on any card to add it here.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}