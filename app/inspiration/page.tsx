import GeneratePrompt from '@/components/GeneratePrompt';
import PromptCard from '@/components/PromptCard';
import Tabs from '@/components/Tabs';

export default function InspirationPage() {
  return (
    <div className="space-y-6">
      {/* Generate Prompt box */}
      <GeneratePrompt />

      {/* Tabs navigation */}
      <Tabs />

      {/* Example Inspiration grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromptCard
          title="Isometric dashboard"
          author="Top Designer"
          image="https://picsum.photos/600/400?random=1"
        />
        <PromptCard
          title="Flat icon set"
          author="Studio"
          image="https://picsum.photos/600/400?random=2"
        />
      </div>
    </div>
  );
}
