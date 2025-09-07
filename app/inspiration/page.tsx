// app/inspiration/page.tsx
import Tabs from "@/components/Tabs";
import PromptGrid, { type Prompt } from "@/components/PromptGrid";

const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: 1,
    title: "Isometric dashboard",
    owner: "Top Designer",            // ✅ matches Prompt.owner
    prompt:
      "Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.",
    // image_url: "https://..."       // optional; leave out if you don't need it
  },
  {
    id: 2,
    title: "Flat icon set",
    owner: "Studio",
    prompt:
      "Create a set of flat, friendly UI icons for a productivity app. Include tasks, calendar, and notes.",
    // image_url: "https://..."
  },
];

export default function InspirationPage() {
  const all = SAMPLE_PROMPTS;
  const mine: Prompt[] = []; // fill later with the signed-in user's prompts

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Inspiration</h1>

      <Tabs
        tabs={[
          { name: "All", content: <PromptGrid prompts={all} /> },
          { name: "Mine", content: <PromptGrid prompts={mine} emptyMessage="No prompts yet." /> },
        ]}
      />
    </div>
  );
}
