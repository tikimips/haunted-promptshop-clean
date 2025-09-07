// components/InfiniteFeed.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import PromptGrid, { type Prompt } from "./PromptGrid";

type FeedLoader = (page: number) => Promise<Prompt[]>;

type Props = {
  loadPage: FeedLoader;             // async loader returning Prompts
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function InfiniteFeed(props: Props) {
  const { loadPage, ...passThrough } = props;

  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (loading || done) return;
      setLoading(true);
      try {
        const next = await loadPage(page);
        if (!cancel) {
          if (!next.length) setDone(true);
          setItems((prev) => prev.concat(next));
        }
      } catch (e) {
        console.error("feed load error", e);
        if (!cancel) setDone(true);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [page, loadPage, loading, done]);

  useEffect(() => {
    if (!sentinelRef.current || done) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setPage((p) => p + 1);
        }
      }
    });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [done]);

  return (
    <>
      <PromptGrid items={items} {...passThrough} />
      <div
        ref={sentinelRef}
        className="py-6 text-center text-sm text-neutral-500"
      >
        {done ? "— End —" : loading ? "Loading…" : "Scroll to load more"}
      </div>
    </>
  );
}