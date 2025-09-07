// components/InfiniteFeed.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PromptGrid from "./PromptGrid";
import type { Prompt } from "@/app/types";

type Props = {
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function InfiniteFeed(props: Props) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadPage = useCallback(async (nextPage: number) => {
    if (loading || done) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?page=${nextPage}`, { cache: "no-store" });
      const data = await res.json();
      const newItems: Prompt[] = data.items ?? [];
      if (newItems.length === 0) setDone(true);
      setItems(prev => [...prev, ...newItems]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }, [loading, done]);

  useEffect(() => {
    // load first page
    loadPage(1);
  }, [loadPage]);

  useEffect(() => {
    if (!sentinelRef.current || done) return;
    const io = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && !loading) loadPage(page + 1);
    }, { rootMargin: "600px" });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [page, loading, done, loadPage]);

  return (
    <>
      <PromptGrid items={items} {...props} />
      <div ref={sentinelRef} className="py-6 text-center text-sm text-neutral-500">
        {done ? "— End —" : loading ? "Loading…" : "Scroll to load more"}
      </div>
    </>
  );
}