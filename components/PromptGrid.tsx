"use client";

import { useMemo } from "react";
import toast from "react-hot-toast";
import { Heart, HeartOff, Copy } from "lucide-react";
import type { Prompt } from "@/app/types";

type Props = {
  items: Prompt[];
  onCopy?: (text: string) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptGrid({ items, onCopy, onSave, onToggleFavorite }: Props) {
  const cols = useMemo(() => "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", []);

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    onCopy?.(text);
    toast.success("Prompt copied");
  }

  return (
    <div className={cols}>
      {items.map((p) => (
        <article key={p.id} className="rounded-xl border overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.imageUrl} alt="" className="h-48 w-full object-cover" />
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium line-clamp-1">{p.title}</h3>
              <button
                className="p-1 rounded hover:bg-neutral-100"
                onClick={() => (onToggleFavorite ? onToggleFavorite(p) : undefined)}
                title={p.favorite ? "Unfavorite" : "Favorite"}
              >
                {p.favorite ? <Heart className="size-4 fill-red-500 text-red-500" /> : <HeartOff className="size-4" />}
              </button>
            </div>
            <p className="text-sm text-neutral-600 line-clamp-2">{p.description}</p>
            <div className="flex gap-2">
              <button className="rounded border px-2 py-1 text-sm" onClick={() => copy(p.promptText)}>
                <span className="inline-flex items-center gap-1"><Copy className="size-3" /> Copy</span>
              </button>
              <button className="rounded border px-2 py-1 text-sm" onClick={() => onSave?.(p)}>
                Save
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}