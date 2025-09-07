// components/PromptGrid.tsx
"use client";

import { useMemo } from "react";
import { Clipboard, Heart, Save } from "lucide-react";
import toast from "react-hot-toast";

export type Prompt = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  description: string;
  favorite?: boolean;
  createdAt: string; // ISO string
  prompt?: string;
};

type Props = {
  /** Accept either prop name so pages can pass items OR prompts */
  items?: Prompt[];
  prompts?: Prompt[];
};

const LS_KEY = "promptshop:mine";

function upsertMine(next: Prompt) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const list: Prompt[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((p) => p.id === next.id);
    if (idx >= 0) list[idx] = next;
    else list.unshift(next);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    /* no-op */
  }
}

function toggleFavorite(p: Prompt) {
  const updated: Prompt = { ...p, favorite: !p.favorite };
  upsertMine(updated);
  return updated;
}

export default function PromptGrid({ items, prompts }: Props) {
  const data = useMemo<Prompt[]>(() => {
    return (items ?? prompts ?? []).map((p) => ({
      // normalize to avoid undefineds blowing up TS elsewhere
      id: String(p.id),
      title: p.title ?? "Untitled",
      author: p.author ?? "Unknown",
      imageUrl:
        p.imageUrl ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
      description: p.description ?? "",
      favorite: Boolean(p.favorite),
      createdAt: p.createdAt || new Date().toISOString(),
      prompt: p.prompt,
    }));
  }, [items, prompts]);

  const onCopy = async (p: Prompt) => {
    try {
      await navigator.clipboard.writeText(p.prompt || p.description || p.title);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const onSave = (p: Prompt) => {
    upsertMine(p);
    toast.success("Saved to Prompt Library");
  };

  const onHeart = (p: Prompt) => {
    const updated = toggleFavorite(p);
    // lightweight feedback; grid isn’t re-rendering from LS here
    toast.success(updated.favorite ? "Added to favorites" : "Removed favorite");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((p) => (
        <article
          key={p.id}
          className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
        >
          <div className="relative aspect-[16/9] w-full bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.imageUrl}
              alt={p.title}
              className="h-full w-full object-cover"
            />

            {/* Hover controls */}
            <div className="pointer-events-none absolute inset-0 flex items-start justify-end gap-2 p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => onCopy(p)}
                className="pointer-events-auto inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs shadow"
                aria-label="Copy prompt"
                title="Copy"
              >
                <Clipboard className="h-4 w-4" />
                Copy
              </button>
              <button
                onClick={() => onSave(p)}
                className="pointer-events-auto inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs shadow"
                aria-label="Save"
                title="Save"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={() => onHeart(p)}
                className={`pointer-events-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs shadow ${
                  p.favorite ? "bg-red-500 text-white" : "bg-white/90"
                }`}
                aria-label="Favorite"
                title="Favorite"
              >
                <Heart className="h-4 w-4" fill={p.favorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="truncate text-base font-semibold">{p.title}</h3>
            <p className="mt-0.5 text-sm text-neutral-500">{p.author}</p>
            <p className="mt-2 line-clamp-2 text-sm text-neutral-700">
              {p.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}