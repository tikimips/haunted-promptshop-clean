"use client";

import PromptCard from "@/components/PromptCard";
import { Prompt } from "@/app/types";

type Props = {
  items: Prompt[];
  onCopy?: (text: string) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptGrid({ items, ...handlers }: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <PromptCard key={p.id} item={p} {...handlers} />
      ))}
    </section>
  );
}