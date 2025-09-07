"use client";

export type Prompt = {
  id: string | number;
  title?: string | null;
  owner?: string | null;
  prompt?: string | null;        // description/body
  image_url?: string | null;
};

type PromptCardProps = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const title = prompt.title ?? "Untitled prompt";
  const author = prompt.owner ?? "Unknown";
  const blurb = (prompt.prompt ?? "").toString();

  return (
    <div className="rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="mb-2 text-sm text-neutral-500">by {author}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {blurb && (
        <p className="mt-2 text-sm text-neutral-600">
          {blurb.length > 140 ? blurb.slice(0, 140) + "…" : blurb}
        </p>
      )}
    </div>
  );
}
