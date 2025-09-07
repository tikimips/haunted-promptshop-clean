// app/library/page.tsx
import PromptGrid from '@/components/PromptGrid';
import type { Prompt } from '@/app/types';

export default async function LibraryPage() {
  // TODO: replace with your real fetch from Supabase (typed as Prompt[])
  const myPrompts: Prompt[] = [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Library</h1>

      {myPrompts.length === 0 ? (
        <p className="text-neutral-600">No prompts yet.</p>
      ) : (
        <PromptGrid prompts={myPrompts} />
      )}
    </main>
  );
}
