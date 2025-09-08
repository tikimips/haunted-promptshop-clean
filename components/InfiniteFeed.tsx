// components/InfiniteFeed.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import PromptGrid, { type Prompt } from "@/components/PromptGrid";

type FeedLoader = (page: number) => Promise<Prompt[]>;

type Props = {
  loadPage: FeedLoader;
  onCopy: (text: string) => void;
  onSave: (p: Prompt) => void;
  onToggleFavorite: (p: Prompt) => void;
};

export default function InfiniteFeed({ loadPage, ...handlers }: Props) {
  const [items, setItems] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const go = async () => {
      if (loading || done) return;
      setLoading(true);
      const batch = await loadPage(page);
      setItems((prev) => [...prev, ...batch]);
      setDone(batch.length === 0);
      setLoading(false);
    };
    go();
  }, [page]); // eslint-disable-line

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && !done) {
        setPage((p) => p + 1);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [done, loading]);

  return (
    <>
      <PromptGrid items={items} {...handlers} />
      <div ref={sentinelRef} className="py-6 text-center text-sm text-neutral-500">
        {done ? "— End —" : loading ? "Loading…" : "Scroll to load more"}
      </div>
    </>
  );
}