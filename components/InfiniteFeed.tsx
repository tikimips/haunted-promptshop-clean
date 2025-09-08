"use client";

import { useEffect, useRef, useState } from "react";
import PromptGrid from "./PromptGrid";
import type { Prompt } from "@/app/types";

type Props = {
  /** Loader that returns the next page of feed items */
  loadPage: (page: number) => Promise<Prompt[]>;
  /** Copy handler receives the prompt text */
  onCopy?: (text: string) => void;
  /** Save handler receives the full Prompt */
  onSave?: (p: Prompt) => void;
  /** Favorite toggle handler receives the full Prompt */
  onToggleFavorite?: (p: Prompt) => void;
};

export default function InfiniteFeed({
  loadPage,
  onCopy,
  onSave,
  onToggleFavorite,
}: Props) {
  const [items, setItems] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load first page on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const first = await loadPage(1);
        if (!cancelled) {
          setItems(first);
          setDone(first.length === 0);
          setPage(2);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPage]);

  // Intersection Observer to trigger more loads
  useEffect(() => {
    if (!sentinelRef.current || done || loading) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !loading && !done) {
        void loadMore();
      }
    });

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, done, loading, page]);

  const loadMore = async () => {
    if (loading || done) return;
    setLoading(true);
    try {
      const next = await loadPage(page);
      setItems((prev) => [...prev, ...next]);
      if (next.length === 0) {
        setDone(true);
      } else {
        setPage((p) => p + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PromptGrid
        items={items}
        onCopy={onCopy}
        onSave={onSave}
        onToggleFavorite={onToggleFavorite}
      />
      <div ref={sentinelRef} className="py-6 text-center text-sm text-neutral-500">
        {done ? "— End —" : loading ? "Loading…" : "Scroll to load more"}
      </div>
    </>
  );
}