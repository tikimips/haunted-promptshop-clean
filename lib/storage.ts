import type { Prompt } from "@/app/types";

const KEY = "haunted_mine_v1";

export function readMine(): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Prompt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeMine(newItem: Prompt): Prompt[] {
  if (typeof window === "undefined") return [];
  const cur = readMine();
  const next = [newItem, ...cur];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function setMine(next: Prompt[]): Prompt[] {
  if (typeof window === "undefined") return [];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function toggleFavorite(id: string): Prompt[] {
  const cur = readMine();
  const next = cur.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p));
  return setMine(next);
}