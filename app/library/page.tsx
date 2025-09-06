import { Tabs } from '@/components/Tabs';
import { PromptCard } from '@/components/PromptCard';

export default function LibraryPage() {
  return (
    <section>
      <Tabs />
      <div className="grid grid-cols-1 gap-3">
        <PromptCard
          title="Isometric mobile UI with pastel palette"
          prompt="minimalist isometric mobile app screen, soft off‑white background, subtle drop shadows, 8‑pt spacing grid, rounded 20px cards, muted pastel palette..."
          thumbnail="https://images.unsplash.com/photo-1520975682031-ae7e06e44f38?w=400"
          tags={['isometric-ui','pastel','rounded-cards']}
        />
      </div>
    </section>
  );
}
