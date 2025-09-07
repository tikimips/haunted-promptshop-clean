import type { Prompt } from "@/app/types";
import PromptCard from "./PromptCard";

export default function PromptGrid({ prompts }: { prompts: Prompt[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {prompts.map((p) => (
        <PromptCard key={p.id} prompt={p} />
      ))}
    </div>
  );
}
