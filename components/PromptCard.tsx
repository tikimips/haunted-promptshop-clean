// components/PromptCard.tsx
'use client';

import Image from 'next/image';
import { Prompt } from '@/app/types';
import { Heart } from 'lucide-react';

type Props = {
  prompt: Prompt;
  onFavoriteToggle?: (id: string, next: boolean) => void;
};

export default function PromptCard({ prompt, onFavoriteToggle }: Props) {
  const {
    id,
    title,
    author = '',
    description = '',
    imageUrl = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop',
    favorite = false,
  } = prompt;

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {onFavoriteToggle && (
          <button
            aria-label={favorite ? 'Unfavorite' : 'Favorite'}
            onClick={() => onFavoriteToggle(id, !favorite)}
            className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 p-2 shadow-sm hover:bg-white"
          >
            <Heart
              className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-neutral-700'}`}
            />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {!!author && <p className="text-sm text-neutral-600 mt-1">{author}</p>}
        {!!description && (
          <p className="text-neutral-700 mt-3 leading-relaxed line-clamp-3">{description}</p>
        )}
      </div>
    </article>
  );
}
