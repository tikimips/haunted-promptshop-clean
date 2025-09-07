// app/inspiration/page.tsx
import PromptGrid from '@/components/PromptGrid';
import type { Prompt } from '@/app/types';

const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: 'isometric-dashboard',
    title: 'Isometric dashboard',
    author: 'Top Designer',
    description:
      'Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'flat-icon-set',
    title: 'Flat icon set',
    author: 'Studio',
    description:
      'Create 24 flat icons for a productivity app (outline + filled variants).',
    imageUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function InspirationPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Inspiration</h1>
      <PromptGrid prompts={SAMPLE_PROMPTS} />
    </main>
  );
}
