// components/PromptCard.tsx
import Image from "next/image";
import { Prompt } from "../app/types"; // components -> ../app/types

type PromptCardProps = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const { title, author, description, imageUrl } = prompt;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      {imageUrl ? (
        <div className="mb-3 overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={title}
            width={1200}
            height={800}
            className="h-48 w-full object-cover"
            priority={false}
          />
        </div>
      ) : (
        <div className="mb-3 h-48 w-full rounded-xl bg-neutral-100" />
      )}

      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-2 text-sm text-neutral-500">by {author}</p>
      <p className="text-sm text-neutral-700">{description}</p>

      <div className="mt-3 flex gap-2">
        <button className="rounded-lg border px-3 py-1 text-sm hover:bg-neutral-50">
          Generate Prompt
        </button>
        <button className="rounded-lg border px-3 py-1 text-sm hover:bg-neutral-50">
          Open
        </button>
      </div>
    </div>
  );
}
