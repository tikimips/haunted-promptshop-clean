// app/inspiration/page.tsx
import Tabs from '@/components/Tabs';
import PromptGrid, { type Prompt } from '@/components/PromptGrid';

const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'Isometric dashboard',
    owner: 'Top Designer',
    prompt:
      'Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Flat icon set',
    owner: 'Studio',
    prompt:
      'Create a minimal flat icon set for a developer tools website. Clean lines, high contrast.',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Landing hero',
    owner: 'Brand Lab',
    prompt:
      'Hero headline + subcopy for a startup landing page focused on speed and reliability.',
    imageUrl: 'https://picsum.photos/seed/hero/1200/800',
  },
];

export default function InspirationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inspiration</h1>

      <Tabs
        tabs={[
          {
            name: 'All',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PromptGrid prompts={SAMPLE_PROMPTS} />
              </div>
            ),
          },
          {
            name: 'Design',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PromptGrid prompts={SAMPLE_PROMPTS.slice(0, 2)} />
              </div>
            ),
          },
          {
            name: 'Copy',
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PromptGrid prompts={SAMPLE_PROMPTS.slice(2)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
