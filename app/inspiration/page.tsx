import PromptGrid from "@/components/PromptGrid";
import type { Prompt } from "@/app/types";

/** Temporary sample data so the page has content */
const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: "1",
    title: "Isometric dashboard",
    author: "Top Designer",
    description:
      "Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.",
    imageUrl:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Flat icon set",
    author: "Studio",
    description:
      "Create 24 flat icons for a productivity app (outline + filled variants).",
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function InspirationPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">Inspiration</h1>
      <PromptGrid prompts={SAMPLE_PROMPTS} />
    </main>
  );
}
