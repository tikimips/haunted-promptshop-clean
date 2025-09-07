// components/PromptGrid.tsx
"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Copy, Bookmark } from "lucide-react";

export type Prompt = {
  id: string;
  title: string;
  author: string;
  description?: string;
  imageUrl: string;
  source?: string;
  promptText?: string;      // <- store the generated prompt here
  favorite?: boolean;
  createdAt?: string;       // ISO string
};

type Props = {
  items: Prompt[];
};

export default function PromptGrid({ items }: Props) {
  // Infinite scroll (client-side): reveal more in chunks of 12
  const CHUNK = 12;
  const [visible, setVisible] = useState(CHUNK);
  const canGrow = visible < items.length;

  const slice = useMemo(() => items.slice(0, visible), [items, visible]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!canGrow || !sentinelRef.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setVisible((v) => Math.min(v + CHUNK, items.length));
      });
    }, { rootMargin: "600px 0px" });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [canGrow, items.length]);

  // actions (copy/save/fav) — wire to Supabase later; for now, just UX
  const handleCopy = async (p: Prompt) => {
    const text = p.promptText || p.title || "";
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied prompt:", text);
    } catch (e) {
      console.warn("Clipboard failed", e);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {slice.map((p) => (
          <div
            key={p.id}
            className="group relative overflow-hidden rounded-xl border border-neutral-200"
          >
            <div className="relative aspect-[16/10] w-full bg-neutral-100">
              <Image
                src={p.imageUrl}
                alt={p.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>

            {/* hover overlay */}
            <div className="absolute inset-0 hidden items-end bg-black/55 p-3 text-white opacity-0 transition-all group-hover:flex group-hover:opacity-100">
              <div className="w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p.title}</div>
                    <div className="truncate text-xs text-neutral-200">{p.author}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(p)}
                      className="rounded-md bg-white/10 p-2 hover:bg-white/20"
                      title="Copy prompt"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-white/10 p-2 hover:bg-white/20"
                      title="Save"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-white/10 p-2 hover:bg-white/20"
                      title="Favorite"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* caption */}
            <div className="p-3">
              <div className="truncate text-sm font-semibold">{p.title}</div>
              <div className="truncate text-xs text-neutral-500">{p.author}</div>
            </div>
          </div>
        ))}
      </div>

      {/* sentinel for infinite scroll */}
      {canGrow && <div ref={sentinelRef} className="h-10 w-full" />}
    </>
  );
}