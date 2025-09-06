'use client';
import { useState } from 'react';
import { PromptDetail } from '@/components/PromptDetail';

type Props = {
  id?: string;
  title: string;
  prompt: string;
  thumbnail?: string;
  tags?: string[];
  createdAt?: string;
};

export function PromptCard({ id, title, prompt, thumbnail, tags, createdAt }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <article className="group rounded-xl border bg-white overflow-hidden relative">
      {/* Thumbnail */}
      {thumbnail && (
        <button onClick={() => setOpen(true)} className="block w-full text-left">
          <img src={thumbnail} alt="" className="w-full h-40 object-cover transition group-hover:scale-[1.02]" />
        </button>
      )}

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/35 transition">
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition">
          <div className="pointer-events-auto backdrop-blur bg-white/80 border rounded-xl p-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="text-[11px] text-neutral-600">{createdAt ? new Date(createdAt).toLocaleDateString() : ''}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onCopy} className="px-2.5 py-1 text-xs rounded-lg border">{copied ? 'Copied' : 'Copy'}</button>
                <button onClick={() => setOpen(true)} className="px-2.5 py-1 text-xs rounded-lg border">Open</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static content under image */}
      <div className="p-3">
        <h3 className="font-medium">{title}</h3>
        {tags && <div className="mt-1 flex gap-2 flex-wrap">{tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 border">{t}</span>)}</div>}
        <pre className="sr-only">{prompt}</pre>
      </div>

      <PromptDetail open={open} onClose={() => setOpen(false)} title={title} prompt={prompt} thumbnail={thumbnail} tags={tags} createdAt={createdAt} />
    </article>
  );
}
