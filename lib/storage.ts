"use client";
import type { Prompt } from "@/app/types";

const KEY = "promptshop.mine.v1";

export function readMine(): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(KEY);
    return s ? (JSON.parse(s) as Prompt[]) : [];
  } catch { return []; }
}

export function writeMine(newItem: Prompt): Prompt[] {
  const all = readMine();
  const idx = all.findIndex(x => x.id === newItem.id);
  if (idx >= 0) all[idx] = newItem; else all.unshift(newItem);
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export function toggleFavorite(id: string): Prompt[] {
  const all = readMine();
  const i = all.findIndex(p => p.id === id);
  if (i >= 0) all[i].favorite = !all[i].favorite;
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}