// components/PromptGrid.tsx
"use client";

import { memo } from "react";
import PromptCard from "./PromptCard";
import type { Prompt } from "@/app/types";

type Props = {
  items: Prompt[];
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (id: string) => void;
  onCopy?: (text: string) => void;
};

function Grid({ items, onSave, onToggleFavorite, onCopy }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((p) => (
        <PromptCard
          key={p.id}
          prompt={p}
          onSave={onSave}
          onToggleFavorite={onToggleFavorite}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}

export default memo(Grid);