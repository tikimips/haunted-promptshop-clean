// components/PromptGrid.tsx
"use client";

import { useCallback } from "react";
import type { Prompt } from "@/app/types";

type Props = {
  items: Prompt[];
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptGrid({ items, onCopy, onSave, onToggleFavorite }: Props) {
  const copy = useCallback(async (p: Prompt) => {
    await navigator.clipboard.writeText(p.prompt || "");
    onCopy?.(p);
  }, [onCopy]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((p) => (
        <article
          key={p.id}
          className="group overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="relative aspect-[16/10] w-full">
            {/* use <img> to avoid Next image-domain config hassles */}
            <img
              src={p.imageUrl}
              alt={p.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* hover controls */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
            <div className="absolute right-3 top-3 hidden gap-2 group-hover:flex">
              <button
                className="pointer-events-auto rounded-full bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white"
                onClick={() => copy(p)}
                aria-label="Copy prompt"
              >Copy</button>
              <button
                className="pointer-events-auto rounded-full bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white"
                onClick={() => onSave?.(p)}
                aria-label="Save"
              >Save</button>
              <button
                className={`pointer-events-auto rounded-full px-2 py-1 text-xs font-medium ${
                  p.favorite ? "bg-rose-500 text-white" : "bg-white/90 hover:bg-white"
                }`}
                onClick={() => onToggleFavorite?.(p)}
                aria-label="Favorite"
              >
                ❤
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="line-clamp-1 font-medium">{p.title}</h3>
            <p className="line-clamp-2 text-sm text-neutral-500">{p.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}