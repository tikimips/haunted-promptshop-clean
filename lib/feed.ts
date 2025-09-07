// lib/feed.ts
import type { Prompt } from "@/app/types";

export async function loadFeedPage(page: number): Promise<Prompt[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/feed?page=${page}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return (data.items ?? []) as Prompt[];
}