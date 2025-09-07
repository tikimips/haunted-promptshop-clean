"use client";

import { useEffect, useRef, useState } from "react";
import PromptGrid from "./PromptGrid";
import type { Prompt } from "@/app/types";

export type FeedLoader = (page: number) => Promise<Prompt[]>;

type Props = {
  loadPage: FeedLoader;
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function InfiniteFeed({ loadPage, ...callbacks }: Props) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      const next = await loadPage(page).catch(() => []);
      if (!ignore) {
        if (next.length === 0) setDone(true);
        setItems((prev) => [...prev, ...next]);
        setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [page, loadPage]);

  useEffect(() => {
    if (!sentinelRef.current || done) return;
    const node = sentinelRef.current;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && !done) {
        setPage((p) => p + 1);
      }
    }, { rootMargin: "400px" });
    obs.observe(node);
    return () => obs.disconnect();
  }, [loading, done]);

  return (
    <>
      <PromptGrid items={items} {...callbacks} />
      <div ref={sentinelRef} className="py-6 text-center text-sm text-neutral-500">
        {done ? "— End —" : loading ? "Loading…" : "Scroll to load more"}
      </div>
    </>
  );
}