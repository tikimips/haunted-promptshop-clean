// components/PromptCard.tsx
'use client';

import Image from 'next/image';
import { Prompt } from '@/app/types';

type PromptCardProps = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const {
    title,
    author,
    description,
    imageUrl,
  } = prompt;

  const displayAuthor = author ?? 'Unknown';
  const displayDesc = (description ?? '').trim();

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {imageUrl ? (
        <div className="relative h-56 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
      ) : (
        <div className="h-56 w-full bg-neutral-100" />
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="mt-1 text-sm text-neutral-500">{displayAuthor}</p>
        {displayDesc && (
          <p className="mt-2 text-sm text-neutral-700 line-clamp-3">
            {displayDesc}
          </p>
        )}
      </div>
    </article>
  );
}
