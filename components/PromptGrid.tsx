"use client";
import Image from "next/image";
import { useCallback } from "react";
import { Heart, Copy, Bookmark } from "lucide-react";
import clsx from "clsx";
import type { Prompt } from "@/app/types";
import toast from "react-hot-toast";

type Props = {
  items: Prompt[];
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptGrid({ items, onSave, onToggleFavorite }: Props) {
  const onCopy = useCallback(async (p: Prompt) => {
    const text = p.promptText || `${p.title} — ${p.description}`;
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <div key={p.id} className="group relative overflow-hidden rounded-xl border bg-white">
          <div className="relative aspect-[16/10] w-full">
            <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{p.title}</div>
              <button
                onClick={() => onToggleFavorite?.(p)}
                className={clsx("rounded p-1 transition", p.favorite ? "text-red-600" : "text-neutral-500 hover:text-neutral-700")}
                title="Favorite"
              >
                <Heart className={clsx("h-5 w-5", p.favorite && "fill-red-600")} />
              </button>
            </div>
            <div className="mt-1 line-clamp-2 text-sm text-neutral-600">{p.description}</div>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden items-start justify-end gap-2 p-3 group-hover:flex">
            <div className="pointer-events-auto flex gap-2">
              <button onClick={() => onCopy(p)} className="rounded bg-white/90 px-2 py-1 text-xs shadow">Copy</button>
              {onSave && (
                <button onClick={() => onSave(p)} className="rounded bg-black px-2 py-1 text-xs text-white shadow flex items-center gap-1">
                  <Bookmark className="h-3.5 w-3.5" /> Save
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}