import { Tabs } from '@/components/Tabs';
import { GeneratePromptCTA } from '@/components/GeneratePrompt';
import Link from 'next/link';

const SAMPLE = [
  { id: 1, title: 'Isometric dashboard', author: 'Top Designer', src: 'https://images.unsplash.com/photo-1520975682031-ae7e06e44f38?w=800' },
  { id: 2, title: 'Flat icon set', author: 'Studio', src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800' },
];

export default function InspirationPage() {
  return (
    <section>
      <Tabs />

      <div className="mb-4 flex items-center justify-between">
        <GeneratePromptCTA />
        <div className="flex items-center gap-2">
          <Link href="#" className="text-sm px-3 py-2 rounded-lg border">Source: All</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SAMPLE.map(card => (
          <article key={card.id} className="rounded-xl overflow-hidden border bg-white group">
            <img src={card.src} alt="" className="w-full h-48 object-cover transition group-hover:scale-[1.02]" />
            <div className="p-3">
              <h3 className="font-medium">{card.title}</h3>
              <p className="text-xs text-neutral-500">by {card.author}</p>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1.5 text-sm rounded-lg border">Generate Prompt</button>
                <button className="px-3 py-1.5 text-sm rounded-lg border">Open</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
