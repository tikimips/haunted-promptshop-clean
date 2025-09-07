// components/PromptCard.tsx
"use client";

import Image from "next/image";
import { useCallback } from "react";
import { Heart, Copy, BookmarkPlus } from "lucide-react";
import type { Prompt } from "@/app/types";

type Props = {
  prompt: Prompt;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (id: string) => void;
  onCopy?: (text: string) => void;
};

export default function PromptCard({
  prompt,
  onSave,
  onToggleFavorite,
  onCopy,
}: Props) {
  const { id, title, author, description, imageUrl, favorite } = prompt;

  const handleCopy = useCallback(() => {
    if (onCopy && prompt.promptText) onCopy(prompt.promptText);
    else if (prompt.description) onCopy?.(prompt.description);
    else if (title) onCopy?.(title);
  }, [onCopy, prompt, title]);

  const handleSave = useCallback(() => {
    onSave?.(prompt);
  }, [onSave, prompt]);

  const handleFavorite = useCallback(() => {
    onToggleFavorite?.(id);
  }, [onToggleFavorite, id]);

  return (
    <article className="card group">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.png"} // always a string for Next/Image
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 768px) 33vw, 100vw"
          priority={false}
        />
        {/* Hover controls */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={handleCopy}
            className="button button--soft pointer-events-auto"
            title="Copy"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleSave}
            className="button button--soft pointer-events-auto"
            title="Save to Library"
          >
            <BookmarkPlus className="h-4 w-4" />
          </button>
          <button
            onClick={handleFavorite}
            className={`button button--soft pointer-events-auto ${
              favorite ? "bg-black text-white" : ""
            }`}
            title={favorite ? "Unfavorite" : "Favorite"}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        <p className="mt-1 text-xs text-neutral-500">{author}</p>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-700">
          {description}
        </p>
      </div>
    </article>
  );
}