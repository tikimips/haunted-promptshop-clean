// app/inspiration/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import InfiniteFeed from '@/components/InfiniteFeed';
import PromptGrid from '@/components/PromptGrid';
import GeneratePrompt from '@/components/GeneratePrompt';
import type { Prompt } from '@/app/types';
import { ToastProvider } from '@/components/Toast';

const SAVE_KEY = 'myPrompts';
const SWITCH_FLAG_KEY = 'switchToLibrary';

function normalizeMine(raw: unknown): Prompt[] {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((p: any) => {
    const createdAt: string =
      typeof p?.createdAt === 'string' && p.createdAt
        ? p.createdAt
        : new Date().toISOString();

    return {
      id: String(p?.id ?? crypto.randomUUID()),
      title: String(p?.title ?? 'Untitled prompt'),
      author: String(p?.author ?? 'Unknown'),
      description: String(p?.description ?? ''),
      imageUrl:
        typeof p?.imageUrl === 'string' || p?.imageUrl === null ? p.imageUrl : null,
      favorite: Boolean(p?.favorite),
      createdAt,
    } satisfies Prompt;
  });
}

export default function InspirationPage() {
  const [tab, setTab] = useState<'all' | 'mine'>('all');
  const [mine, setMine] = useState<Prompt[]>([]);
  const [favFirst, setFavFirst] = useState(true);

  function loadMine() {
    try {
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
      setMine(normalizeMine(raw));
    } catch {
      setMine([]);
    }
  }

  useEffect(() => {
    loadMine();
    if (localStorage.getItem(SWITCH_FLAG_KEY) === '1') {
      setTab('mine');
      localStorage.removeItem(SWITCH_FLAG_KEY);
    }
    const onStorage = () => loadMine();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const sortedMine = useMemo(() => {
    if (!mine.length) return [];
    let arr = [...mine];
    arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (favFirst) {
      const fav = arr.filter((p) => p.favorite);
      const rest = arr.filter((p) => !p.favorite);
      fav.sort((a, b) => a.title.localeCompare(b.title));
      arr = [...fav, ...rest];
    }
    return arr;
  }, [mine, favFirst]);

  return (
    <ToastProvider>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold">Inspiration</h1>
          <GeneratePrompt />
        </div>

        {/* Tabs */}
        <div className="mb-4 flex items-center gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === 'all'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setTab('all')}
          >
            All
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === 'mine'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setTab('mine')}
          >
            Prompt Library
          </button>

          {tab === 'mine' && (
            <label className="ml-4 inline-flex items-center gap-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={favFirst}
                onChange={(e) => setFavFirst(e.target.checked)}
              />
              Favorites first (A→Z)
            </label>
          )}
        </div>

        {/* Content */}
        {tab === 'all' ? (
          <InfiniteFeed />
        ) : sortedMine.length ? (
          <PromptGrid prompts={sortedMine} />
        ) : (
          <p className="py-10 text-center text-neutral-500">
            Nothing saved yet. Use <b>Save</b> on any card to add it here.
          </p>
        )}
      </main>
    </ToastProvider>
  );
}