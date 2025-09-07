// lib/feed.ts
import type { Prompt } from "@/types";

const SEED_FEED: Prompt[] = [
  {
    id: "seed-1",
    title: "Isometric dashboard",
    description: "Generate UI copy for a sleek isometric analytics dashboard",
    imageUrl: "https://source.unsplash.com/random/400x300?dashboard",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "Flat icon set",
    description: "Create 24 flat icons for a productivity app (outline + filled).",
    imageUrl: "https://source.unsplash.com/random/400x300?icons",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
];

export async function loadFeedPage(
  page: number,
  pageSize: number = 6
): Promise<Prompt[]> {
  // In real app, fetch from API. For now, repeat seed items.
  const start = page * pageSize;
  return SEED_FEED.slice(0, pageSize).map((p, i) => ({
    ...p,
    id: `${p.id}-${start + i}`,
    createdAt: new Date().toISOString(),
  }));
}

export { SEED_FEED };