// app/inspiration/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Prompt } from '@/app/types';
import PromptGrid from '@/components/PromptGrid';
import SavePromptModal from '@/components/SavePromptModal';
import { ClipboardIcon, BookmarkPlusIcon } from '@/components/icons';

// --- Local storage helpers ---
const STORAGE_KEY = 'ps_saved_prompts_v1';

function loadSaved(): Prompt[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Prompt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSaved(list: Prompt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

// --- Sample "All" data (static) ---
const ALL_PROMPTS: Prompt[] = [
  {
    id: 's1',
    title: 'Isometric dashboard',
    author: 'Top Designer',
    description:
      'Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop',
    createdAt: '2024-01-01T00:00:00.000Z',
    favorite: false,
  },
  {
    id: 's2',
    title: 'Flat icon set',
    author: 'Studio',
    description:
      'Create 24 flat icons for a productivity app (outline + filled variants).',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop',
    createdAt: '2024-01-02T00:00:00.000Z',
    favorite: false,
  },
];

// --- UI ---
export default function InspirationPage() {
  const [tab, setTab] = useState<'all' | 'mine'>('all');
  const [saved, setSaved] = useState<Prompt[]>([]);
  const [draft, setDraft] = useState(
    'Create a high-contrast, minimalist landing hero with bold headline, subcopy, and a single CTA button. Use one striking photo background with soft vignette and lots of whitespace.'
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  // sorting for "Mine":
  //   1) favorites first (alphabetical by title)
  //   2) then the rest, reverse chronological by createdAt
  const mineSorted = useMemo(() => {
    const favs = saved.filter((p) => p.favorite).sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    const rest = saved
      .filter((p) => !p.favorite)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return [...favs, ...rest];
  }, [saved]);

  function handleCopy() {
    navigator.clipboard.writeText(draft).catch(() => {});
  }

  function handleSave(name: string) {
    const newPrompt: Prompt = {
      id: Math.random().toString(36).slice(2),
      title: name,
      author: 'You',
      description: draft,
      imageUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
      favorite: false,
    };
    const next = [newPrompt, ...saved];
    setSaved(next);
    persistSaved(next);
    setSaving(false);
    setTab('mine');
  }

  function toggleFavorite(id: string, nextFav: boolean) {
    const next = saved.map((p) => (p.id === id ? { ...p, favorite: nextFav } : p));
    setSaved(next);
    persistSaved(next);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inspiration</h1>
        <button
          onClick={() => setSaving(true)}
          className="rounded-full bg-black px-4 py-2 text-white hover:bg-black/90"
        >
          + Generate Prompt
        </button>
      </header>

      {/* Draft Prompt bar */}
      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
        <div className="flex items-start gap-4">
          <div className="hidden h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-100 md:block">
            <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,#cbd5e1,transparent_60%),radial-gradient(circle_at_70%_70%,#e5e7eb,transparent_55%)]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-neutral-800">Draft prompt</div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="mt-2 w-full resize-y rounded-lg border border-neutral-300 px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex shrink-0 flex-col gap-2 md:flex-row">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
              title="Copy to clipboard"
            >
              <ClipboardIcon className="h-4 w-4" />
              Copy
            </button>
            <button
              onClick={() => setSaving(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-black/90"
              title="Save prompt"
            >
              <BookmarkPlusIcon className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('all')}
          className={`rounded-full px-4 py-2 text-sm ${
            tab === 'all' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setTab('mine')}
          className={`rounded-full px-4 py-2 text-sm ${
            tab === 'mine' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800'
          }`}
        >
          Mine
        </button>
      </div>

      {/* Content */}
      {tab === 'all' ? (
        <PromptGrid prompts={ALL_PROMPTS} />
      ) : (
        <PromptGrid prompts={mineSorted} onFavoriteToggle={toggleFavorite} />
      )}

      {/* Save modal */}
      <SavePromptModal
        open={saving}
        initialName=""
        onCancel={() => setSaving(false)}
        onSave={handleSave}
      />
    </main>
  );
}
