// components/PromptGrid.tsx
"use client";

import Image from "next/image";
import { Heart, Copy, Bookmark } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export type Prompt = {
  id: string;
  title: string;
  author?: string;
  description?: string;
  imageUrl?: string;
  favorite?: boolean;
  createdAt: string; // must be a string for type-compat in builds
};

type Props = {
  prompts: Prompt[];
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptGrid({ prompts, onCopy, onSave, onToggleFavorite }: Props) {
  if (!prompts?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((p) => (
        <Card
          key={p.id}
          p={p}
          onCopy={onCopy}
          onSave={onSave}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

function Card({
  p,
  onCopy,
  onSave,
  onToggleFavorite
}: {
  p: Prompt;
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-colors"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[16/9] w-full bg-neutral-100">
        {p.imageUrl ? (
          <Image
            src={p.imageUrl}
            alt={p.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : null}

        {/* hover controls */}
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 flex items-start justify-end gap-2 p-3 transition-opacity",
            hover ? "opacity-100" : "opacity-0"
          )}
        >
          <button
            className="pointer-events-auto rounded-md bg-white/90 px-2 py-1 text-sm shadow"
            onClick={() => onCopy?.(p)}
            aria-label="Copy"
          >
            <div className="flex items-center gap-1"><Copy size={16}/> Copy</div>
          </button>
          <button
            className="pointer-events-auto rounded-md bg-white/90 px-2 py-1 text-sm shadow"
            onClick={() => onSave?.(p)}
            aria-label="Save"
          >
            <div className="flex items-center gap-1"><Bookmark size={16}/> Save</div>
          </button>
          <button
            className={clsx(
              "pointer-events-auto rounded-md px-2 py-1 text-sm shadow",
              p.favorite ? "bg-rose-600 text-white" : "bg-white/90"
            )}
            onClick={() => onToggleFavorite?.(p)}
            aria-label="Favorite"
          >
            <div className="flex items-center gap-1"><Heart size={16} fill={p.favorite ? "white" : "none"}/> Fav</div>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="text-base font-semibold">{p.title}</div>
        {p.author ? <div className="text-sm text-neutral-500">{p.author}</div> : null}
        {p.description ? (
          <div className="mt-1 line-clamp-2 text-sm text-neutral-600">{p.description}</div>
        ) : null}
      </div>
    </div>
  );
}