"use client";

import PromptCard from "./PromptCard";
import type { Prompt } from "@/app/types";

// Re-export the type so imports like { type Prompt } from "@/components/PromptGrid" keep working.
export type { Prompt } from "@/app/types";

type Props = {
  items: Prompt[];
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptGrid({ items, onCopy, onSave, onToggleFavorite }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <PromptCard
          key={p.id}
          prompt={p}
          onCopy={onCopy}
          onSave={onSave}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}