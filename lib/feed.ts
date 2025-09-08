// lib/feed.ts
import type { Prompt } from "@/components/PromptGrid";

export async function loadFeedPage(page: number): Promise<Prompt[]> {
  const res = await fetch(`/api/feed?page=${page}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []) as Prompt[];
}