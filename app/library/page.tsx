import PromptGrid from "@/components/PromptGrid";
import type { Prompt } from "@/app/types";

export default async function LibraryPage() {
  // TODO: replace with a real fetch of *your* prompts from Supabase for the signed-in user
  const myPrompts: Prompt[] = [];

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">Library</h1>
      {myPrompts.length === 0 ? (
        <p className="text-neutral-600">No prompts yet.</p>
      ) : (
        <PromptGrid prompts={myPrompts} />
      )}
    </main>
  );
}
