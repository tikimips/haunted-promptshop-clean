// components/InfiniteFeed.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PromptGrid from "./PromptGrid";
import type { Prompt } from "@/app/types";

type Props = {
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function InfiniteFeed(props: Props) {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (loading || done) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/feed?page=${nextPage}`, { cache: "no-store" });
        const data = await res.json();
        const newItems: Prompt[] = data.items ?? [];
        if (newItems.length === 0) setDone(true);
        setItems((prev) => [...prev, ...newItems]);
        setPage(nextPage);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    [loading, done]
  );

  // Ensure we fill viewport on first load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadPage(1);
      // Keep loading until we exceed viewport or we tried 4 pages
      let tries = 0;
      while (!cancelled && document.body.scrollHeight < window.innerHeight * 1.6 && tries < 3 && !done) {
        await loadPage(tries + 2);
        tries++;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPage, done]);

  // IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || done) return;
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading) loadPage(page + 1);
      },
      { root: null, rootMargin: "1200px 0px", threshold: 0 }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [page, loading, done, loadPage]);

  const showLoadMore = useMemo(() => !done && !loading, [done, loading]);

  return (
    <>
      <PromptGrid items={items} {...props} />
      <div ref={sentinelRef} className="py-6 text-center text-sm text-neutral-500">
        {done ? "— End —" : loading ? "Loading…" : "Scroll to load more"}
      </div>
      {showLoadMore && (
        <div className="pb-10 text-center">
          <button
            className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50"
            onClick={() => loadPage(page + 1)}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}