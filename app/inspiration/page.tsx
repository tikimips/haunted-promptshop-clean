// app/inspiration/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Tabs from '@/components/Tabs';
import PromptGrid from '@/components/PromptGrid';
import type { Prompt } from '@/app/types';
import Modal from '@/components/Modal';
import DropZone from '@/components/DropZone';

const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: 'isometric-dashboard',
    title: 'Isometric dashboard',
    author: 'Top Designer',
    description:
      'Generate UI copy for a sleek isometric analytics dashboard with monochrome palette.',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'flat-icon-set',
    title: 'Flat icon set',
    author: 'Studio',
    description:
      'Create 24 flat icons for a productivity app (outline + filled variants).',
    imageUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function InspirationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState<string | null>(null);

  const tabs = useMemo(
    () => [
      { name: 'All', content: <PromptGrid prompts={SAMPLE_PROMPTS} /> },
      { name: 'Mine', content: <PromptGrid prompts={[]} /> },
    ],
    []
  );

  const handleGenerateClick = () => setModalOpen(true);

  const handleSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setSelectedPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const runGenerate = async () => {
    if (!selectedFile) return;
    try {
      setPending(true);

      // For now, we don’t upload the image; we just call the stub API.
      // Later: send { imageBase64, filename } to /api/generate-prompt.
      const res = await fetch('/api/generate-prompt', { method: 'POST' });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Failed to generate');

      setDraftPrompt(json.prompt as string);
      setModalOpen(false);
    } catch (e: any) {
      alert(e.message || 'Failed to generate prompt');
    } finally {
      setPending(false);
    }
  };

  const clearDraft = () => {
    setDraftPrompt(null);
    setSelectedFile(null);
    setSelectedPreview(null);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inspiration</h1>
        <button
          onClick={handleGenerateClick}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Generate Prompt
        </button>
      </div>

      {/* Draft bar (appears after selecting an image and generating) */}
      {draftPrompt && (
        <div className="mb-6 flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
          {selectedPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedPreview}
              alt="Selected"
              className="h-16 w-24 rounded object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">Draft prompt</div>
            <p className="truncate text-sm text-neutral-700">{draftPrompt}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
              onClick={() => navigator.clipboard.writeText(draftPrompt)}
            >
              Copy
            </button>
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
              onClick={clearDraft}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <Tabs tabs={tabs} />

      {/* Generate modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="+ Generate Prompt"
      >
        {!selectedFile ? (
          <DropZone onSelect={handleSelect} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPreview ?? ''}
                alt="Preview"
                className="h-28 w-44 rounded object-cover"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">Image selected</div>
                <div className="text-xs text-neutral-600">
                  {selectedFile.name} · {(selectedFile.size / 1024).toFixed(0)} KB
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={() => {
                  setSelectedFile(null);
                  setSelectedPreview(null);
                }}
              >
                Choose another
              </button>
              <button
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                onClick={runGenerate}
                disabled={pending}
              >
                {pending ? 'Generating…' : 'Generate'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
