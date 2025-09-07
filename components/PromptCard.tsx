// components/PromptCard.tsx
'use client';

import { useCallback } from 'react';
import type { Prompt } from '@/app/types';
import { useToast } from '@/components/Toast';

const SAVE_KEY = 'myPrompts';

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const { addToast } = useToast();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt.description || '');
      addToast({ message: 'Prompt copied to clipboard 📋', variant: 'success' });
    } catch {
      addToast({ message: 'Could not copy. Select and copy manually.', variant: 'error' });
    }
  }, [prompt, addToast]);

  const toggleFav = useCallback(() => {
    try {
      const list: Prompt[] = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
      const idx = list.findIndex((p) => p.id === prompt.id);
      if (idx >= 0) {
        list[idx].favorite = !list[idx].favorite;
        localStorage.setItem(SAVE_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event('storage'));
        addToast({
          message: list[idx].favorite ? 'Added to favorites ❤️' : 'Removed from favorites 💔',
          variant: 'info',
        });
      }
    } catch { /* noop */ }
  }, [prompt.id, addToast]);

  return (
    <div className="group relative rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={prompt.imageUrl || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop'}
          alt={prompt.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {/* Hover overlay quick actions */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end gap-2 p-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); copy(); }}
            className="rounded-md bg-white/90 px-3 py-1 text-sm font-medium text-neutral-900 shadow"
          >
            Copy
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFav(); }}
            className="rounded-md bg-black/80 px-3 py-1 text-sm font-medium text-white shadow"
          >
            {prompt.favorite ? '♥' : '♡'}
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="line-clamp-1 text-base font-semibold text-neutral-900">
          {prompt.title}
        </div>
        <div className="mt-0.5 text-sm text-neutral-500">
          {new Date(prompt.createdAt).toLocaleDateString()} · {prompt.author}
        </div>
      </div>
    </div>
  );
}