// components/PromptGrid.tsx
"use client";

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
      {items.map((p) => (
        <Card
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

function Card({
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
  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={prompt.title} src={prompt.imageUrl} className="h-full w-full object-cover" />
        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/40 group-hover:flex">
          <button
            className="rounded-md bg-white/90 px-2 py-1 text-xs"
            onClick={() => onCopy?.(prompt)}
          >
            Copy
          </button>
          <button
            className="rounded-md bg-white/90 px-2 py-1 text-xs"
            onClick={() => onSave?.(prompt)}
          >
            Save
          </button>
          <button
            className="rounded-md bg-white/90 px-2 py-1 text-xs"
            onClick={() => onToggleFavorite?.(prompt)}
          >
            {prompt.favorite ? "♥" : "♡"}
          </button>
        </div>
      </div>
      <div className="space-y-1 p-3">
        <div className="line-clamp-1 text-sm font-semibold">{prompt.title}</div>
        <div className="line-clamp-1 text-xs text-neutral-500">{prompt.author}</div>
        <div className="line-clamp-2 text-xs text-neutral-600">{prompt.description}</div>
      </div>
    </div>
  );
}