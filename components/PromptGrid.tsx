// components/PromptGrid.tsx
import PromptCard from './PromptCard';
import { Prompt } from '@/app/types';

type PromptGridProps = {
  prompts: Prompt[];
};

export default function PromptGrid({ prompts }: PromptGridProps) {
  if (!prompts || prompts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
        No prompts yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {prompts.map((p) => (
        <PromptCard key={String(p.id)} prompt={p} />
      ))}
    </div>
  );
}
