// components/PromptCard.tsx
"use client";

import toast from "react-hot-toast";
import { Prompt } from "@/app/types";

const STORAGE_KEY = "ps:mine";

function readMine(): Prompt[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeMine(items: Prompt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function PromptCard({
  item,
  onChange,
  showHoverActions = true,
}: {
  item: Prompt;
  onChange?: (next: Prompt) => void;
  showHoverActions?: boolean;
}) {
  const { id, imageUrl, name, prompt, favorite, createdAt } = item;

  function copyPrompt() {
    navigator.clipboard.writeText(prompt || "").then(() => {
      toast.success("Prompt copied to clipboard");
    });
  }

  function toggleFavorite() {
    const mine = readMine();
    const next = mine.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m));
    writeMine(next);
    onChange?.({ ...item, favorite: !favorite });
    toast.success(!favorite ? "Added to favorites" : "Removed from favorites");
  }

  function saveFromFeed() {
    // saving "as-is" when coming from a feed card
    const mine = readMine();
    const entry: Prompt = {
      id,
      name,
      prompt,
      imageUrl,
      favorite: false,
      createdAt: createdAt || new Date().toISOString(),
    };
    writeMine([entry, ...mine]);
    toast.success("Saved to your Prompt Library");
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="p-4">
        <div className="mb-1 line-clamp-1 text-sm font-medium">{name}</div>
        <div className="line-clamp-2 text-xs text-neutral-600">{prompt || "—"}</div>
      </div>

      {showHoverActions && (
        <div className="pointer-events-none absolute inset-0 hidden items-start justify-end gap-2 p-3 group-hover:flex">
          <button
            onClick={copyPrompt}
            className="pointer-events-auto rounded bg-white/90 px-2 py-1 text-xs shadow"
            title="Copy prompt"
          >
            📋 Copy
          </button>
          <button
            onClick={saveFromFeed}
            className="pointer-events-auto rounded bg-white/90 px-2 py-1 text-xs shadow"
            title="Save to library"
          >
            💾 Save
          </button>
          <button
            onClick={toggleFavorite}
            className="pointer-events-auto rounded bg-white/90 px-2 py-1 text-xs shadow"
            title="Favorite"
          >
            {favorite ? "❤️" : "🤍"} Fav
          </button>
        </div>
      )}
    </div>
  );
}