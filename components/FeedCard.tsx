// components/FeedCard.tsx
'use client';

import { useCallback } from 'react';
import { useToast } from '@/components/Toast';

export type FeedItem = {
  id: string;
  title?: string;
  author?: string;
  source: string;
  imageUrl: string;
  prompt?: string;
};

export default function FeedCard({
  item,
  isFavorite,
  onFavorite,
  onSave,
}: {
  item: FeedItem;
  isFavorite: boolean;
  onFavorite: (id: string, next: boolean) => void;
  onSave: (item: FeedItem) => void;
}) {
  const { addToast } = useToast();

  const copy = useCallback(async () => {
    const text =
      item.prompt ||
      `Create a concept inspired by "${item.title || 'this piece'}" from ${item.source}.`;
    try {
      await navigator.clipboard.writeText(text);
      addToast({ message: 'Prompt copied to clipboard 📋', variant: 'success' });
    } catch {
      addToast({ message: 'Could not copy. Select and copy manually.', variant: 'error' });
    }
  }, [item, addToast]);

  const save = useCallback(() => {
    onSave(item);
    addToast({ message: 'Saved to Prompt Library ✅', variant: 'success' });
  }, [item, onSave, addToast]);

  const toggleFav = useCallback(() => {
    onFavorite(item.id, !isFavorite);
    addToast({
      message: isFavorite ? 'Removed from favorites 💔' : 'Added to favorites ❤️',
      variant: 'info',
    });
  }, [item.id, isFavorite, onFavorite, addToast]);

  return (
    <div className="group relative rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.title || 'Inspiration'}
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 flex items-start justify-end gap-2 p-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFav(); }}
            className="rounded-md bg-white/90 px-2 py-1 text-sm font-medium text-neutral-900 shadow"
            title={isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end gap-2 p-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); copy(); }}
            className="rounded-md bg-white/90 px-3 py-1 text-sm font-medium text-neutral-900 shadow"
            title="Copy prompt"
          >
            Copy
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); save(); }}
            className="rounded-md bg-black/80 px-3 py-1 text-sm font-medium text-white shadow"
            title="Save to Prompt Library"
          >
            Save
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="line-clamp-1 text-base font-semibold text-neutral-900">
          {item.title || 'Untitled'}
        </div>
        <div className="mt-0.5 text-sm text-neutral-500">
          {item.author || item.source}
        </div>
      </div>
    </div>
  );
}