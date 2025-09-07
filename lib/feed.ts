// app/lib/feed.ts
import type { Prompt } from "@/components/PromptGrid";

export const SEED_FEED: Prompt[] = [
  {
    id: "1",
    title: "Isometric dashboard",
    author: "Top Designer",
    imageUrl: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    description: "Crisp UI with geometric depth",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Abstract gradients",
    author: "Visual Artist",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Moody product shot",
    author: "Photographer",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  // add more if you want — the grid will infinite-scroll this list
];