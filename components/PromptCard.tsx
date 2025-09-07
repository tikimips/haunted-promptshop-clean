// components/PromptCard.tsx
"use client";

import Image from "next/image";
import { Copy, BookmarkPlus, Heart } from "lucide-react";
import type { Prompt } from "./PromptGrid";

type Props = {
  prompt: Prompt;
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptCard({
  prompt,
  onCopy,
  onSave,
  onToggleFavorite,
}: Props) {
  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={prompt.imageUrl || "/placeholder.png"}
          alt={prompt.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 33vw"
        />
        <div className="pointer-events-none absolute inset-0 flex items-start justify-end gap-2 p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="pointer-events-auto rounded-md bg-white/90 p-2 shadow"
            onClick={() => onCopy?.(prompt)}
            aria-label="Copy prompt"
            title="Copy prompt"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            className="pointer-events-auto rounded-md bg-white/90 p-2 shadow"
            onClick={() => onSave?.(prompt)}
            aria-label="Save"
            title="Save"
          >
            <BookmarkPlus className="h-4 w-4" />
          </button>
          <button
            className={`pointer-events-auto rounded-md bg-white/90 p-2 shadow ${
              prompt.favorite ? "text-rose-600" : ""
            }`}
            onClick={() => onToggleFavorite?.(prompt)}
            aria-label="Favorite"
            title="Favorite"
          >
            <Heart className="h-4 w-4" fill={prompt.favorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="space-y-1 p-4">
        <h3 className="line-clamp-1 font-medium">{prompt.title}</h3>
        <p className="text-xs text-neutral-500">{prompt.author}</p>
        <p className="line-clamp-2 text-sm text-neutral-600">{prompt.description}</p>
      </div>
    </article>
  );
}