import Image from "next/image";
import type { Prompt } from "@/app/types";

type PromptCardProps = { prompt: Prompt };

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <div className="rounded-xl border p-4 hover:shadow-md transition bg-white">
      {prompt.imageUrl ? (
        <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={prompt.imageUrl}
            alt={prompt.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={false}
          />
        </div>
      ) : (
        <div className="mb-3 aspect-[16/9] rounded-lg bg-neutral-100" />
      )}

      <h3 className="text-lg font-semibold">{prompt.title}</h3>
      <p className="text-sm text-neutral-600">{prompt.author ?? "Unknown"}</p>

      {prompt.description && (
        <p className="mt-2 text-sm text-neutral-700 line-clamp-3">
          {prompt.description}
        </p>
      )}
    </div>
  );
}
