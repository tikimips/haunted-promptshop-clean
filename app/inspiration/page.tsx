// app/inspiration/page.tsx
import PromptGrid from '@/components/PromptGrid';
import { Prompt } from '@/app/types';

const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: 1,
    title: 'Isometric dashboard',
    author: 'Top Designer',
    description:
      'Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.',
    imageUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop', // Unsplash domain is already allowed in next.config.js
  },
  {
    id: 2,
    title: 'Flat icon set',
    author: 'Studio',
    description:
      'Create a flat icon set for a productivity app (tasks, calendar, notes, reminders).',
    imageUrl:
      'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function InspirationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="mb-6 text-2xl font-bold">Inspiration</h1>
      <PromptGrid prompts={SAMPLE_PROMPTS} />
    </div>
  );
}
