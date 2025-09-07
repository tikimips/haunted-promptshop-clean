// components/PromptGrid.tsx
import PromptCard from "./PromptCard";
import { Prompt } from "../app/types"; // components -> ../app/types

type PromptGridProps = {
  prompts: Prompt[];
};

export default function PromptGrid({ prompts }: PromptGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </div>
  );
}
