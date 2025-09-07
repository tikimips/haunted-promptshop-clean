import PromptCard, { type Prompt } from './PromptCard';

export default function PromptGrid({ prompts }: { prompts: Prompt[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </div>
  );
}
