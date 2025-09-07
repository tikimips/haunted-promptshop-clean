// components/PromptCard.tsx
"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { Prompt } from "./PromptGrid";

type Props = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: Props) {
  const [fav, setFav] = useState<boolean>(prompt.favorite);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt ?? "");
    } catch {
      // ignore
    }
  }, [prompt.prompt]);

  const onSave = useCallback(() => {
    try {
      const key = "promptshop:mine";
      const raw = localStorage.getItem(key);
      const list = raw ? (JSON.parse(raw) as Prompt[]) : [];
      // avoid dup by id + title combo
      const exists = list.find(
        (p) => p.title === prompt.title && p.imageUrl === prompt.imageUrl
      );
      if (!exists) {
        const next = [
          {
            ...prompt,
            favorite: fav,
            createdAt: new Date().toISOString(),
          },
          ...list,
        ];
        localStorage.setItem(key, JSON.stringify(next));
      }
    } catch {
      // ignore
    }
  }, [fav, prompt]);

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={prompt.imageUrl}
          alt={prompt.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />
        {/* Hover controls */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity hover:opacity-100" />
        <div className="absolute inset-x-3 bottom-3 flex gap-2">
          <button
            className="rounded-md bg-white/90 px-3 py-1 text-sm font-medium shadow hover:bg-white"
            onClick={onCopy}
          >
            Copy
          </button>
          <button
            className="rounded-md bg-white/90 px-3 py-1 text-sm font-medium shadow hover:bg-white"
            onClick={onSave}
          >
            Save
          </button>
          <button
            className={`rounded-md px-3 py-1 text-sm font-medium shadow ${
              fav ? "bg-rose-500 text-white" : "bg-white/90 hover:bg-white"
            }`}
            onClick={() => setFav((v) => !v)}
          >
            {fav ? "♥ Favorite" : "♡ Favorite"}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{prompt.title}</h3>
        <p className="mt-1 text-sm text-neutral-500">{prompt.author}</p>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
          {prompt.description}
        </p>
      </div>
    </article>
  );
}