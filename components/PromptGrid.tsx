// components/PromptGrid.tsx
"use client";

import { useState } from "react";
import { Prompt } from "@/app/types";
import PromptCard from "./PromptCard";

export default function PromptGrid({ items }: { items: Prompt[] }) {
  const [local, setLocal] = useState(items);

  function onChange(next: Prompt) {
    setLocal((prev) => prev.map((p) => (p.id === next.id ? next : p)));
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {local.map((item) => (
        <PromptCard key={item.id} item={item} onChange={onChange} />
      ))}
    </div>
  );
}