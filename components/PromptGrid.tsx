// components/PromptGrid.tsx
import PromptCard from "@/components/PromptCard";

export type Prompt = {
  id?: string | number;
  title: string;
  author?: string;
  description?: string;
  imageUrl?: string;
};

export default function PromptGrid({ prompts }: { prompts: Prompt[] }) {
  if (!prompts || prompts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-neutral-500">
        No prompts yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {prompts.map((p) => (
        <PromptCard key={String(p.id ?? p.title)} prompt={p} />
      ))}
    </div>
  );
}
