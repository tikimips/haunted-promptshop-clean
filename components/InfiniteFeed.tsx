// components/InfiniteFeed.tsx
'use client';

import useSWRInfinite from 'swr/infinite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FeedCard from './FeedCard';
import type { FeedItem } from '@/app/api/feed/route';

type ApiResp = { page: number; pageSize: number; items: FeedItem[]; hasMore: boolean };
const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<ApiResp>);

const FAV_KEY = 'feed-favorites';
const SAVE_KEY = 'myPrompts';

function loadSet(key: string) {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(key) || '[]'));
  } catch {
    return new Set<string>();
  }
}
function saveSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export default function InfiniteFeed() {
  const [favSet, setFavSet] = useState<Set<string>>(new Set());

  // Hydrate favorites from localStorage
  useEffect(() => {
    setFavSet(loadSet(FAV_KEY));
  }, []);

  const getKey = (pageIndex: number, previousPageData: ApiResp | null) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    const page = pageIndex + 1;
    return `/api/feed?page=${page}`;
  };

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<ApiResp>(
    getKey,
    fetcher,
    { revalidateOnFocus: false }
  );

  const items = useMemo(
    () => (data ? data.flatMap((d) => d.items) : []),
    [data]
  );

  // IntersectionObserver to load next page
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading && !isValidating) {
        setSize((s) => s + 1);
      }
    }, { rootMargin: '1200px' });
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [isLoading, isValidating, setSize]);

  const onFavorite = useCallback((id: string, next: boolean) => {
    setFavSet((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(id);
      else copy.delete(id);
      saveSet(FAV_KEY, copy);
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
      createdAt: Date.now(),
      prompt: `Create a concept inspired by "${item.title}" (${item.source}).`,
    };
    try {
      const list = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
      list.unshift(entry);
      localStorage.setItem(SAVE_KEY, JSON.stringify(list));
      alert('Saved to Mine!');
    } catch {
      alert('Could not save locally (storage blocked).');
    }
  }, []);

  return (
    <div className="w-full">
      {/* 3-col responsive grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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

      {/* sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-12 w-full" />

      {(isLoading || isValidating) && (
        <div className="py-8 text-center text-neutral-500">Loading…</div>
      )}
    </div>
  );
}
