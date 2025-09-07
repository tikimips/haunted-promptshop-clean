import PromptCard, { type Prompt } from "./PromptCard";

type Props = {
  prompts: Prompt[];
  emptyMessage?: string;
};

export default function PromptGrid({ prompts, emptyMessage = "No prompts yet." }: Props) {
  if (!prompts || prompts.length === 0) {
    return <p className="text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {prompts.map((p) => (
        <PromptCard key={String(p.id)} prompt={p} />
      ))}
    </div>
  );
}
