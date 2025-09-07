// lib/storage.ts
import type { Prompt } from "@/types";

export function readMine(): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("mine");
    return raw ? (JSON.parse(raw) as Prompt[]) : [];
  } catch (e) {
    console.error("Failed to parse saved prompts", e);
    return [];
  }
}

export function writeMine(items: Prompt[] | Prompt): Prompt[] {
  if (typeof window === "undefined") return [];
  try {
    // normalize to array
    const current = readMine();
    const toAdd = Array.isArray(items) ? items : [items];
    const updated = [...current, ...toAdd];
    localStorage.setItem("mine", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save prompts", e);
    return readMine();
  }
}