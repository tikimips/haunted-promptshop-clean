// app/library/page.tsx
import PromptGrid, { type Prompt } from "@/components/PromptGrid";

export default async function LibraryPage() {
  // TODO: replace with a real fetch of *your* prompts from Supabase
  // For now, keep it empty to compile & render the page.
  const myPrompts: Prompt[] = [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Library</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Only prompts owned by the signed-in user
      </p>

      <PromptGrid prompts={myPrompts} />
    </div>
  );
}
