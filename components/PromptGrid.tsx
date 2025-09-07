// components/PromptGrid.tsx
"use client";

import Image from "next/image";
import { useCallback } from "react";
import { Heart, Copy, BookmarkPlus } from "lucide-react";

export type Prompt = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  promptText: string;
  favorite: boolean;
  createdAt: string;
};

type Props = {
  items: Prompt[];
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptGrid({
  items,
  onCopy,
  onSave,
  onToggleFavorite,
}: Props) {
  const handleCopy = useCallback(
    (p: Prompt) => onCopy?.(p),
    [onCopy]
  );
  const handleSave = useCallback(
    (p: Prompt) => onSave?.(p),
    [onSave]
  );
  const handleFav = useCallback(
    (p: Prompt) => onToggleFavorite?.(p),
    [onToggleFavorite]
  );

  return (
    <div
      className="
        grid grid-cols-1 gap-6
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {items.map((p) => (
        <article
          key={p.id}
          className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={p.imageUrl || "/placeholder.png"}
              alt={p.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
            {/* Hover controls */}
            <div className="pointer-events-none absolute inset-0 flex items-start justify-end gap-2 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => handleCopy(p)}
                className="pointer-events-auto rounded-md bg-white/90 p-2 shadow"
                aria-label="Copy prompt to clipboard"
                title="Copy prompt"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleSave(p)}
                className="pointer-events-auto rounded-md bg-white/90 p-2 shadow"
                aria-label="Save to library"
                title="Save"
              >
                <BookmarkPlus className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleFav(p)}
                className={`pointer-events-auto rounded-md bg-white/90 p-2 shadow ${
                  p.favorite ? "text-rose-600" : ""
                }`}
                aria-label="Favorite"
                title="Favorite"
              >
                <Heart className="h-4 w-4" fill={p.favorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="space-y-1 p-4">
            <h3 className="line-clamp-1 font-medium">{p.title}</h3>
            <p className="text-xs text-neutral-500">{p.author}</p>
            <p className="line-clamp-2 text-sm text-neutral-600">{p.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}