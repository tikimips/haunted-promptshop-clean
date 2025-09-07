"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Copy, Heart, Save } from "lucide-react";
import type { Prompt } from "@/app/types";

type Props = {
  prompt: Prompt;
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptCard({ prompt, onCopy, onSave, onToggleFavorite }: Props) {
  const [hover, setHover] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt.promptText).catch(() => {});
    onCopy?.(prompt);
  }, [prompt, onCopy]);

  const handleSave = useCallback(() => onSave?.(prompt), [onSave, prompt]);
  const handleFav  = useCallback(() => onToggleFavorite?.(prompt), [onToggleFavorite, prompt]);

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={prompt.imageUrl || "/placeholder.png"}
          alt={prompt.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          unoptimized={prompt.imageUrl.startsWith("data:")}
        />
        {/* Hover controls */}
        <div
          className={`absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-end gap-2 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition
          ${hover ? "translate-y-0 opacity-100" : ""}`}
        >
          <button
            className="rounded-md bg-white/90 p-2 text-sm shadow hover:bg-white"
            onClick={handleCopy}
            title="Copy prompt"
            type="button"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            className="rounded-md bg-white/90 p-2 text-sm shadow hover:bg-white"
            onClick={handleSave}
            title="Save to library"
            type="button"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            className={`rounded-md p-2 text-sm shadow hover:bg-white ${prompt.favorite ? "bg-pink-100 text-pink-600" : "bg-white/90"}`}
            onClick={handleFav}
            title="Favorite"
            type="button"
          >
            <Heart className="h-4 w-4" fill={prompt.favorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold">{prompt.title}</h3>
          <span className="shrink-0 text-xs text-neutral-500">{prompt.author}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-neutral-600">{prompt.description}</p>
      </div>
    </div>
  );
}