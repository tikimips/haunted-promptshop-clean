// lib/storage.ts
import type { Prompt } from "@/types";

/**
 * Read prompts from localStorage
 */
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

/**
 * Save prompts into localStorage
 */
export function saveMine(items: Prompt[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("mine", JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save prompts", e);
  }
}