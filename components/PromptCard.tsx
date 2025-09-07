// components/PromptCard.tsx
'use client';

import { type Prompt } from '@/components/PromptGrid';
// If you want to use Next/Image, leave this import and the <Image/> block.
// If you prefer plain <img> only, you can remove this import and keep the <img> block below.
import Image from 'next/image';

type Props = { prompt: Prompt };

export default function PromptCard({ prompt }: Props) {
  const {
    title = 'Untitled prompt',
    owner = 'Unknown',
    prompt: body = '',
    imageUrl,
  } = prompt;

  const fallback =
    'https://placehold.co/800x500/png?text=Prompt+Preview&font=inter';

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      {/* --- Choose ONE of these two blocks. Keeping both is fine; the first renders, second is a no-op fallback --- */}

      {/* A) Next/Image (needs next.config.js domains) */}
      <div className="relative aspect-[16/9] w-full bg-neutral-100">
        <Image
          src={imageUrl || fallback}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* B) Plain <img> fallback (works without next.config.js) */}
      {/* <img
        src={imageUrl || fallback}
        alt={title}
        className="w-full aspect-[16/9] object-cover bg-neutral-100"
        loading="lazy"
      /> */}

      <div className="p-4">
        <div className="mb-1 text-sm text-neutral-500">by {owner}</div>
        <h3 className="text-lg font-semibold leading-snug">{title}</h3>
        {body ? (
          <p className="mt-2 line-clamp-3 text-sm text-neutral-700">
            {body}
          </p>
        ) : null}

        <div className="mt-4 flex gap-2">
          <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50">
            Generate Prompt
          </button>
          <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50">
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
