'use client';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  prompt: string;
  thumbnail?: string | null;
  tags?: string[] | null;
  createdAt?: string;
};

const RELATED = [
  'https://images.unsplash.com/photo-1520975682031-ae7e06e44f38?w=400',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
  'https://images.unsplash.com/photo-1529336953121-e0b18d2551b7?w=400',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=400'
];

export function PromptDetail({ open, onClose, title, prompt, thumbnail, tags, createdAt }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto max-w-2xl rounded-2xl bg-white shadow-xl border overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          {thumbnail && <img src={thumbnail} alt="" className="w-24 h-24 object-cover rounded-xl border" />}
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-xs text-neutral-500">{createdAt ? new Date(createdAt).toLocaleString() : ''}</p>
            {tags && <div className="mt-1 flex gap-2 flex-wrap">{tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 border">{t}</span>)}</div>}
          </div>
          <button onClick={onClose} className="text-sm px-3 py-1.5 rounded-lg border">Close</button>
        </div>

        <details open className="px-4 pb-3">
          <summary className="cursor-pointer text-sm font-medium select-none py-1">Prompt</summary>
          <pre className="mt-2 text-sm whitespace-pre-wrap bg-neutral-50 border rounded-lg p-3">{prompt}</pre>
          <div className="mt-2 flex gap-2">
            <CopyButton text={prompt} />
            <button className="px-3 py-1.5 text-sm rounded-lg border">Save</button>
            <button className="px-3 py-1.5 text-sm rounded-lg border">Share</button>
            <button className="px-3 py-1.5 text-sm rounded-lg border">Delete</button>
          </div>
        </details>

        <div className="px-4 pb-4">
          <h4 className="text-sm font-medium mb-2">More inspiration</h4>
          <div className="grid grid-cols-3 gap-2">
            {RELATED.sort(() => 0.5 - Math.random()).slice(0, 6).map((u, i) => (
              <img key={i} src={u} className="w-full h-24 object-cover rounded-lg border" alt="" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  async function onCopy() {
    await navigator.clipboard.writeText(text);
    const el = document.createElement('div');
    el.textContent = 'Copied';
    el.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black text-white text-sm';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
  return <button onClick={onCopy} className="px-3 py-1.5 text-sm rounded-lg border">Copy</button>;
}
