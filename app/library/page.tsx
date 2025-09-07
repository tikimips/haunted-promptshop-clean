import PromptCard from "@/components/PromptCard";

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromptCard
          title="Custom prompt collection"
          author="You"
          description="Saved prompts that you’ve added to your library."
        />
        <PromptCard
          title="Team brainstorming set"
          author="Design Team"
          description="Prompts collected during a design jam session."
        />
      </div>
    </div>
  );
}
