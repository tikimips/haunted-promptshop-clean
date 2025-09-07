// app/inspiration/page.tsx
import Tabs from "@/components/Tabs";
import PromptGrid, { Prompt } from "@/components/PromptGrid";

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center">
      <p className="text-neutral-600">No prompts yet.</p>
      <p className="mt-2 text-sm text-neutral-500">
        Click <span className="font-medium">Generate prompt</span> on any card
        to add one here.
      </p>
    </div>
  );
}

// Replace this with data you fetch later.
// Leaving a couple of examples so the UI isn’t blank.
const SAMPLE: Prompt[] = [
  {
    id: 1,
    title: "Isometric dashboard",
    author: "Top Designer",
    description:
      "Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Flat icon set",
    author: "Studio",
    description:
      "Prompt for creating a consistent flat icon set for finance apps.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function InspirationPage() {
  // In the future, replace SAMPLE with data from Supabase (or your API).
  const all = SAMPLE;
  const studio = SAMPLE.filter((p) => p.author === "Studio");
  const mine: Prompt[] = []; // if you don’t have user data yet

  const tabs = [
    {
      name: "All",
      content: all.length ? <PromptGrid prompts={all} /> : <EmptyState />,
    },
    {
      name: "Studio",
      content: studio.length ? <PromptGrid prompts={studio} /> : <EmptyState />,
    },
    {
      name: "My Library",
      content: mine.length ? <PromptGrid prompts={mine} /> : <EmptyState />,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inspiration</h1>
        <div className="text-sm text-neutral-500">Source: All</div>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}
