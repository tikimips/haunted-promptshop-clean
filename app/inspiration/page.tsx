// app/inspiration/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import GeneratePrompt from "@/components/GeneratePrompt";
import PromptGrid from "@/components/PromptGrid";
import Tabs from "@/components/Tabs";
import { Prompt } from "@/app/types";

// Local storage helpers (client-side only)
const STORAGE_KEY = "ps:mine";
function readMine(): Prompt[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

// A small seed feed with real images (you can swap with your own source)
const SEED_FEED: Prompt[] = [
  {
    id: crypto.randomUUID(),
    name: "Isometric dashboard",
    prompt: "Generate UI copy for a sleek isometric analytics dashboard.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Flat icon set",
    prompt: "Create 24 flat icons for a productivity app (outline + filled).",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Minimal landing hero",
    prompt: "High-contrast, minimalist hero with bold headline and CTA.",
    imageUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1600&auto=format&fit=crop",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "3D scene",
    prompt: "Low-poly 3D city block at dusk, neon accents, volumetric light.",
    imageUrl: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Editorial portrait",
    prompt: "Moody portrait lighting, cinematic tones, shallow depth of field.",
    imageUrl: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Game HUD",
    prompt: "Futuristic game HUD: health, stamina, minimap, and quest log.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
];

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => {
    setMine(readMine());
    // listen for changes (e.g., another component writing)
    const onFocus = () => setMine(readMine());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Favorites on top (alphabetically by name), then others in reverse chrono
  const sortedMine = useMemo(() => {
    const fav = mine.filter((m) => m.favorite).sort((a, b) => a.name.localeCompare(b.name));
    const rest = mine
      .filter((m) => !m.favorite)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return [...fav, ...rest];
  }, [mine]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inspiration</h1>
      </div>

      {/* Generate Prompt */}
      <GeneratePrompt />

      <Tabs active={tab} onChange={setTab} labels={["All", "Prompt Library"]} />

      {tab === "all" ? (
        <PromptGrid items={SEED_FEED} />
      ) : sortedMine.length ? (
        <PromptGrid items={sortedMine} />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Use <b>Save</b> on any card—or generate your first prompt above.
        </p>
      )}
    </main>
  );
}