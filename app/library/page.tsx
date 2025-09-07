// app/library/page.tsx
import PromptGrid from "@/components/PromptGrid";
import { Prompt } from "../types";

export default function LibraryPage() {
  // For now, empty. (We’ll wire Supabase later.)
  const myPrompts: Prompt[] = [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Library</h1>
      {/* Only prompts owned by the signed-in user */}
      <PromptGrid prompts={myPrompts} />
    </div>
  );
}
