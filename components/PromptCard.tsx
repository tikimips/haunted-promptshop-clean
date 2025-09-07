type Prompt = {
  id: string | number;
  title: string;
  author?: string;
  description?: string;
  imageUrl?: string;
};

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 hover:shadow-md transition">
      {/* Thumbnail */}
      <div className="h-36 w-full rounded-lg bg-neutral-100 mb-3 overflow-hidden">
        {prompt.imageUrl ? (
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      {/* Meta */}
      <div className="text-sm text-neutral-500">by {prompt.author ?? 'Unknown'}</div>
      <div className="font-medium text-neutral-900">{prompt.title}</div>
      {prompt.description && (
        <p className="mt-2 text-sm text-neutral-700 line-clamp-3">{prompt.description}</p>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button className="text-sm rounded-lg border px-3 py-1">Generate Prompt</button>
        <button className="text-sm rounded-lg border px-3 py-1">Open</button>
      </div>
    </div>
  );
}
