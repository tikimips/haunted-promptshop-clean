// components/PromptGrid.tsx
"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Prompt } from "@/app/types";

export type Props = {
  items: Prompt[];
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptGrid({ items, onCopy, onSave, onToggleFavorite }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(p => (
        <PromptCard
          key={p.id}
          prompt={p}
          onCopy={onCopy}
          onSave={onSave}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

function PromptCard({
  prompt,
  onCopy,
  onSave,
  onToggleFavorite,
}: {
  prompt: Prompt;
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
}) {
  const [hover, setHover] = useState(false);
  const copy = useCallback(() => onCopy?.(prompt), [onCopy, prompt]);
  const save = useCallback(() => onSave?.(prompt), [onSave, prompt]);
  const toggleFav = useCallback(() => onToggleFavorite?.(prompt), [onToggleFavorite, prompt]);

  return (
    <div
      className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[4/3] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={prompt.title}
          src={prompt.imageUrl}
          className="h-full w-full object-cover"
        />
        {hover && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40">
            <button
              className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white"
              onClick={copy}
            >
              Copy
            </button>
            <button
              className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white"
              onClick={save}
            >
              Save
            </button>
            <button
              aria-label="Favorite"
              className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white"
              onClick={toggleFav}
            >
              ♥
            </button>
          </div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <div className="line-clamp-1 text-sm font-semibold">{prompt.title}</div>
        <div className="line-clamp-1 text-xs text-neutral-500">{prompt.author}</div>
        <div className="line-clamp-2 text-xs text-neutral-600">{prompt.description}</div>
      </div>
    </div>
  );
}