// components/FeedCard.tsx
'use client';

import { useCallback } from 'react';

export type FeedItem = {
  id: string;
  title?: string;
  author?: string;
  source: string;     // e.g., 'dribbble', 'behance', 'unsplash'
  imageUrl: string;   // absolute URL
  prompt?: string;    // optional suggested prompt text
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
  const copy = useCallback(async () => {
    const text =
      item.prompt ||
      `Create a concept inspired by "${item.title || 'this piece'}" from ${item.source}.`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
  }, [item]);

  return (
    <div className="group relative rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-neutral-100">
        {/* Using <img> avoids Next Image domain whitelisting issues */}
        <img
          src={item.imageUrl}
          alt={item.title || 'Inspiration'}
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {/* Hover controls */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-end gap-2 p-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(item.id, !isFavorite);
            }}
            className="rounded-md bg-white/90 px-2 py-1 text-sm font-medium text-neutral-900 shadow"
            title={isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end gap-2 p-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copy();
            }}
            className="rounded-md bg-white/90 px-3 py-1 text-sm font-medium text-neutral-900 shadow"
            title="Copy prompt"
          >
            Copy
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(item);
            }}
            className="rounded-md bg-black/80 px-3 py-1 text-sm font-medium text-white shadow"
            title="Save to Mine"
          >
            Save
          </button>
        </div>
      </div>

      {/* Meta */}
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
