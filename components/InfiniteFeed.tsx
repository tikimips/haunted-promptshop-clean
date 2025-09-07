// components/InfiniteFeed.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { Prompt } from "@/app/types";
import PromptGrid from "./PromptGrid";

type Props = {
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function InfiniteFeed(props: Props) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Prompt[]>([]);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  // load a page
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/feed?page=${page}`);
      const data = await res.json();
      if (ignore) return;
      const next: Prompt[] = data.items || [];
      setItems((cur) => [...cur, ...next]);
      if (next.length === 0) setDone(true);
      setLoading(false);
    })();
    return () => { ignore = true; };
  }, [page]);

  // infinite observer
  useEffect(() => {
    if (!sentinelRef.current || done) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setPage((p) => p + 1);
    }, { rootMargin: "600px 0px" });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [done]);

  return (
    <>
      <PromptGrid items={items} {...props} />
      <div ref={sentinelRef} className="py-6 text-center text-sm text-neutral-500">
        {done ? "— End —" : loading ? "Loading…" : "Scroll to load more"}
      </div>
    </>
  );
}