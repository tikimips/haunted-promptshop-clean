import PromptGrid from "@/components/PromptGrid";

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Library</h1>
      {/* Only prompts owned by the signed-in user */}
      <PromptGrid mine />
    </div>
  );
}
