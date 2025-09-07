// components/PromptCard.tsx
import Image from "next/image";
import { Prompt } from "../app/types";

type PromptCardProps = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 overflow-hidden rounded-lg">
        <Image
          src={prompt.imageUrl}
          alt={prompt.title}
          width={800}
          height={500}
          className="h-48 w-full object-cover"
          priority={false}
        />
      </div>
      <h3 className="text-lg font-semibold">{prompt.title}</h3>
      <p className="text-sm text-neutral-500">by {prompt.author}</p>
      <p className="mt-2 text-sm text-neutral-600">{prompt.description}</p>
    </div>
  );
}
