"use client";

import { useEffect, useRef, useState } from "react";
import type { Prompt } from "@/app/types";
import PromptGrid from "./PromptGrid";

type Props = {
  loadPage: (page: number) => Promise<Prompt[]>;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function InfiniteFeed({ loadPage, onSave, onToggleFavorite }: Props) {
  const [items, setItems] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { void grab(page); }, []); // first page

  async function grab(pg: number) {
    if (loading || done) return;
    setLoading(true);
    const next = await loadPage(pg);
    setItems(prev => [...prev, ...next]);
    setDone(next.length === 0);
    setLoading(false);
  }

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && !done) {
        const nextPage = page + 1;
        setPage(nextPage);
        void grab(nextPage);
      }
    }, { rootMargin: "100px" });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [page, loading, done]);

  return (
    <>
      <PromptGrid items={items} onSave={onSave} onToggleFavorite={onToggleFavorite} />
      <div ref={sentinelRef} className="py-6 text-center text-sm text-neutral-500">
        {done ? "— End —" : loading ? "Loading…" : "Scroll to load more"}
      </div>
    </>
  );
}