// components/PromptGrid.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import PromptCard from "./PromptCard";

export type Prompt = {
  id: string;
  title: string;
  author: string;
  imageUrl: string; // must be a string for next/image
  description: string;
  favorite: boolean;
  createdAt: string;
  prompt: string;
};

type Props = {
  prompts: Prompt[];
};

// Lightweight “infinite scroll”: repeats provided prompts in pages
export default function PromptGrid({ prompts }: Props) {
  const PAGE_SIZE = 9; // 3 columns x 3 rows
  const [page, setPage] = useState(1);
  const loadRef = useRef<HTMLDivElement | null>(null);

  // derive items to show
  const items = Array.from({ length: page * PAGE_SIZE }, (_, i) => {
    const src = prompts[i % prompts.length];
    return { ...src, id: `${src.id}__${i}` };
  });

  useEffect(() => {
    if (!loadRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "1200px 0px 1200px 0px" } // eager load
    );

    io.observe(loadRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
      </div>

      {/* Infinite loader sentinel */}
      <div ref={loadRef} className="h-1 w-full" aria-hidden />
    </>
  );
}