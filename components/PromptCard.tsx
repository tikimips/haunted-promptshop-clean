// components/PromptCard.tsx
"use client";

import Image from "next/image";
import { Heart, Copy, Save } from "lucide-react";
import { type Prompt } from "@/app/types";

type Props = {
  item: Prompt;
  onCopy?: (text: string) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptCard({ item, onCopy, onSave, onToggleFavorite }: Props) {
  const text = item.promptText || "";

  return (
    <article className="rounded-2xl border bg-white p-3 shadow-sm">
      {item.imageUrl ? (
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        </div>
      ) : null}
      <h3 className="line-clamp-1 font-medium">{item.title}</h3>
      {item.description ? (
        <p className="line-clamp-2 text-xs text-neutral-500">{item.description}</p>
      ) : null}
      <div className="mt-3 flex items-center gap-2">
        <button
          className="rounded-md border px-2.5 py-1 text-xs hover:bg-neutral-50"
          onClick={() => onCopy?.(text)}
          title="Copy prompt"
        >
          <Copy className="mr-1 inline h-3.5 w-3.5" />
          Copy
        </button>
        <button
          className="rounded-md border px-2.5 py-1 text-xs hover:bg-neutral-50"
          onClick={() => onSave?.(item)}
          title="Save to Library"
        >
          <Save className="mr-1 inline h-3.5 w-3.5" />
          Save
        </button>
        <button
          className={`ml-auto rounded-md border px-2.5 py-1 text-xs ${
            item.favorite ? "bg-black text-white" : "hover:bg-neutral-50"
          }`}
          onClick={() => onToggleFavorite?.(item)}
          title="Favorite"
        >
          <Heart className="mr-1 inline h-3.5 w-3.5" />
          Favorite
        </button>
      </div>
    </article>
  );
}