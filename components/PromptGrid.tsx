// components/PromptGrid.tsx
'use client';

import PromptCard from './PromptCard';
import type { Prompt } from '@/app/types';

export default function PromptGrid({ prompts }: { prompts: Prompt[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </div>
  );
}