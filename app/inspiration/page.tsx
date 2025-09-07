import PromptGrid from "@/components/PromptGrid";

export default function InspirationPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Inspiration</h1>
      {/* All public/visible prompts */}
      <PromptGrid mine={false} />
    </div>
  );
}
