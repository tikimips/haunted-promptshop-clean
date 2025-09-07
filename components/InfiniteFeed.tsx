// components/InfiniteFeed.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FeedCard from './FeedCard';
import type { FeedItem } from '@/app/api/feed/route';

const FAV_KEY = 'feed-favorites';
const SAVE_KEY = 'myPrompts';

function loadFavs(): Set<string> {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
  } catch {
    return new Set<string>();
  }
}
function saveFavs(set: Set<string>) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
}

export default function InfiniteFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [favSet, setFavSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavSet(loadFavs());
  }, []);

  const fetchPage = useCallback(async (p: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?page=${p}`, { cache: 'no-store' });
      const json = (await res.json()) as {
        page: number;
        pageSize: number;
        items: FeedItem[];
        hasMore: boolean;
      };
      setItems((prev) => [...prev, ...json.items]);
      setHasMore(json.hasMore);
      setPage(p);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) fetchPage(page + 1);
      },
      { rootMargin: '1000px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [page, loading, hasMore, fetchPage]);

  const onFavorite = useCallback((id: string, next: boolean) => {
    setFavSet((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(id); else copy.delete(id);
      saveFavs(copy);
      return copy;
    });
  }, []);

  const onSave = useCallback((item: FeedItem) => {
    const name = window.prompt('Name this prompt:', item.title || 'Untitled prompt');
    const entry = {
      id: `saved-${item.id}-${Date.now()}`,
      title: name || item.title || 'Untitled prompt',
      author: item.author || item.source,
      description: `Saved from ${item.source}.`,
      imageUrl: item.imageUrl,
      favorite: false,
      createdAt: new Date().toISOString(),
    };
    try {
      const list = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
      list.unshift(entry);
      localStorage.setItem(SAVE_KEY, JSON.stringify(list));
    } catch { /* noop */ }
  }, []);

  const grid = useMemo(
    () => (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <FeedCard
            key={item.id}
            item={item}
            onSave={onSave}
            onFavorite={onFavorite}
            isFavorite={favSet.has(item.id)}
          />
        ))}
      </div>
    ),
    [items, favSet, onFavorite, onSave]
  );

  return (
    <div className="w-full">
      {grid}
      <div ref={sentinelRef} className="h-16 w-full" />
      {(loading || !items.length) && (
        <div className="py-8 text-center text-neutral-500">Loading…</div>
      )}
      {!hasMore && (
        <div className="py-8 text-center text-neutral-400">End of feed</div>
      )}
    </div>
  );
}