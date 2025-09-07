'use client';

import Image from 'next/image';
import { Prompt } from '@/app/types'; // <— only source of the type

type PromptCardProps = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const { title, author, description, imageUrl } = prompt;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      {imageUrl ? (
        <div className="mb-3 overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={title}
            width={800}
            height={500}
            className="h-48 w-full object-cover"
          />
        </div>
      ) : null}

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500">by {author}</p>
      <p className="mt-3 text-sm text-neutral-700">{description}</p>
    </div>
  );
}
