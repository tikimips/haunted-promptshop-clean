// components/FeedCard.tsx
'use client';

import Image from 'next/image';
import { CopyIcon, SaveIcon, HeartOutline, HeartSolid } from '@/components/icons';
import type { FeedItem } from '@/app/api/feed/route';

type Props = {
  item: FeedItem;
  onSave?: (item: FeedItem) => void;
  onFavorite?: (id: string, next: boolean) => void;
  isFavorite?: boolean;
};

function copyToClipboard(text: string) {
  try {
    navigator.clipboard?.writeText(text);
  } catch {}
}

export default function FeedCard({ item, onSave, onFavorite, isFavorite }: Props) {
  const promptText = `Create a concept inspired by "${item.title}" (${item.source}).`;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <a href={item.url} target="_blank" rel="noreferrer" className="block relative aspect-[4/3] w-full">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </a>

      {/* Hover controls */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="rounded-full bg-white/95 px-2 py-1 text-xs font-medium text-neutral-700">
          {item.source}
        </span>
        <button
          className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white/95 p-2 shadow-sm hover:bg-white"
          aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
          onClick={() => onFavorite?.(item.id, !isFavorite)}
        >
          {isFavorite ? (
            <HeartSolid className="h-4 w-4 text-red-500" />
          ) : (
            <HeartOutline className="h-4 w-4 text-neutral-800" />
          )}
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="rounded-full bg-white/95 px-2 py-1 text-xs font-medium text-neutral-900 max-w-[75%] truncate">
          {item.title}
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs text-neutral-900 hover:bg-white"
            onClick={() => copyToClipboard(promptText)}
          >
            <CopyIcon />
            Copy
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs text-neutral-900 hover:bg-white"
            onClick={() => onSave?.(item)}
          >
            <SaveIcon />
            Save
          </button>
        </div>
      </div>
    </article>
  );
}
