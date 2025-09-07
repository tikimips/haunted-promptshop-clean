// components/PromptGrid.tsx
import PromptCard from "./PromptCard";
import { Prompt } from "../app/types";

type Props = {
  prompts: Prompt[];
};

export default function PromptGrid({ prompts }: Props) {
  if (!prompts || prompts.length === 0) {
    return <p className="text-neutral-500">No prompts yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </div>
  );
}
