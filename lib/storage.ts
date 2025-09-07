// lib/storage.ts
"use client";

import type { Prompt } from "@/app/types";
const KEY = "mine-prompts";

export function readMine(): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Prompt[];
    // guard: ensure all have promptText
    return parsed.map((p) => ({
      ...p,
      promptText: typeof p.promptText === "string" ? p.promptText : "",
      favorite: Boolean(p.favorite),
      createdAt: p.createdAt || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export function writeMine(newItem: Prompt): Prompt[] {
  const current = readMine();
  const updated = [newItem, ...current];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function overwriteMine(items: Prompt[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function toggleFavorite(id: string): Prompt[] {
  const current = readMine();
  const updated = current.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p));
  overwriteMine(updated);
  return updated;
}