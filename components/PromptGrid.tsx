// components/PromptGrid.tsx
'use client';

import { Prompt } from '@/app/types';
import PromptCard from './PromptCard';

type Props = {
  prompts: Prompt[];
  onFavoriteToggle?: (id: string, next: boolean) => void;
};

export default function PromptGrid({ prompts, onFavoriteToggle }: Props) {
  if (!prompts.length) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-600">
        No prompts yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
}
