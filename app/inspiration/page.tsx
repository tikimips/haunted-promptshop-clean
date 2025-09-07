import PromptCard from "@/components/PromptCard";

export default function InspirationPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Inspiration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromptCard
          title="Isometric dashboard"
          author="Top Designer"
          description="A modern isometric-style dashboard template."
        />
        <PromptCard
          title="Flat icon set"
          author="Studio"
          description="A clean flat-design icon set for product UIs."
        />
      </div>
    </div>
  );
}
