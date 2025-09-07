// app/lib/feed.ts
import type { Prompt } from "@/components/PromptGrid";

const base = [
  "photo-1518779578993-ec3579fee39f",
  "photo-1517694712202-14dd9538aa97",
  "photo-1500530855697-b586d89ba3ee",
  "photo-1469474968028-56623f02e42e",
  "photo-1503602642458-232111445657",
  "photo-1517816743773-6e0fd518b4a6",
];

const url = (seed: string, i: number) =>
  `https://images.unsplash.com/${seed}?q=80&w=1200&auto=format&fit=crop&ixid=${i}`;

export const SEED_FEED: Prompt[] = Array.from({ length: 60 }).map((_, i) => {
  const idx = i % base.length;
  return {
    id: String(i + 1),
    title: `Inspo #${i + 1}`,
    author: ["Top Designer", "Visual Artist", "Photographer"][i % 3],
    imageUrl: url(base[idx], i + 10),
    description: "Seed inspiration",
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
  };
});