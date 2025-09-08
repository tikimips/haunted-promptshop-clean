// lib/storage.ts
import type { Prompt } from "@/app/types";

const KEY = "promptshop:mine";

function read(): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Prompt[]) : [];
  } catch {
    return [];
  }
}

function write(items: Prompt[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function readMine(): Prompt[] {
  return read();
}

export function writeMine(p: Prompt): Prompt[] {
  const curr = read();
  const exists = curr.find((x) => x.id === p.id);
  const next = exists ? curr : [{ ...p }, ...curr];
  write(next);
  return next;
}

export function toggleFavorite(id: string): Prompt[] {
  const curr = read();
  const next = curr.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p));
  write(next);
  return next;
}