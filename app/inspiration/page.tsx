import Tabs from '@/components/Tabs';
import PromptGrid from '@/components/PromptGrid';
import type { Prompt } from '@/components/PromptCard';

const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Isometric dashboard',
    author: 'Top Designer',
    description:
      'Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.',
    imageUrl:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1480&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Flat icon set',
    author: 'Studio',
    description:
      'Create 24 flat icons for a productivity app (outline + filled variants).',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1480&auto=format&fit=crop'
  }
];

export default function InspirationPage() {
  const tabs = [
    { name: 'All', content: <PromptGrid prompts={SAMPLE_PROMPTS} /> },
    { name: 'Mine', content: <PromptGrid prompts={[]} /> }
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold">Inspiration</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}
