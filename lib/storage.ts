// lib/storage.ts
"use client";

import type { Prompt } from "@/app/types";

const KEY = "mine-prompts";

export function readMine(): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Prompt[]) : [];
  } catch {
    return [];
  }
}

export function writeMine(p: Prompt): Prompt[] {
  const existing = readMine();
  const updated = [p, ...existing]; // newest first
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function writeMineAll(list: Prompt[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}