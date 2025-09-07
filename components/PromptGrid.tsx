// components/PromptGrid.tsx
import PromptCard from "@/components/PromptCard";

export type Prompt = {
  id: string | number;
  title?: string | null;
  prompt?: string | null;      // the text of the prompt
  owner?: string | null;       // display name / author
  image_url?: string | null;   // optional thumbnail
};

type PromptGridProps = {
  prompts: Prompt[];
  emptyMessage?: string;
};

export default function PromptGrid({ prompts, emptyMessage = "No prompts yet." }: PromptGridProps) {
  if (!prompts || prompts.length === 0) {
    return <p className="text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {prompts.map((p) => (
        <PromptCard key={String(p.id)} prompt={p} />
      ))}
    </div>
  );
}
