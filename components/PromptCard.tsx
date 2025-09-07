type Prompt = {
  id: string | number;
  title: string;
  author?: string;
};

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="h-36 w-full rounded-lg bg-neutral-100 mb-3" />
      <div className="text-sm text-neutral-500">by {prompt.author ?? 'Unknown'}</div>
      <div className="font-medium">{prompt.title}</div>
      <div className="mt-3 flex gap-2">
        <button className="text-sm rounded-lg border px-3 py-1">Generate Prompt</button>
        <button className="text-sm rounded-lg border px-3 py-1">Open</button>
      </div>
    </div>
  );
}
