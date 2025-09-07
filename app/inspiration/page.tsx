// app/inspiration/page.tsx
import PromptGrid from "@/components/PromptGrid";
import { Prompt } from "../types"; // app/inspiration -> ../types

// Temporary sample cards to verify UI
const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: "1",
    title: "Isometric dashboard",
    author: "Top Designer",
    description:
      "Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.",
    imageUrl:
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Flat icon set",
    author: "Studio",
    description:
      "A clean flat icon set for a developer dashboard. 24px, rounded corners.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function InspirationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Inspiration</h1>
      <PromptGrid prompts={SAMPLE_PROMPTS} />
    </div>
  );
}
