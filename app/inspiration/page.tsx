import Tabs from '@/components/Tabs';
import PromptCard from '@/components/PromptCard';

export default function InspirationPage() {
  // Dummy prompts for now – these should eventually come from Supabase
  const prompts = [
    { id: 1, title: 'Isometric dashboard', author: 'Top Designer' },
    { id: 2, title: 'Flat icon set', author: 'Studio' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Inspiration</h1>
      <Tabs
        tabs={[
          { name: 'All', content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) },
          { name: 'Library', content: <div>No prompts yet.</div> },
        ]}
      />
    </div>
  );
}
