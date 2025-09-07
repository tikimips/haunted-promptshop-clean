// components/GeneratePrompt.tsx
'use client';

import { useCallback, useRef, useState } from 'react';
import { Loader2, Upload, Camera, ImagePlus } from 'lucide-react';
import type { Prompt } from '@/app/types';
import { useToast } from '@/components/Toast';

const SAVE_KEY = 'myPrompts';
const SWITCH_FLAG_KEY = 'switchToLibrary';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
}

export default function GeneratePrompt() {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const photosInputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      addToast({ message: 'Please drop an image file.', variant: 'error' });
      return;
    }
    const dataUrl = await fileToDataUrl(f);
    setImageDataUrl(dataUrl);
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''));
  }, [addToast, name]);

  const prevent = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  async function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await fileToDataUrl(f);
    setImageDataUrl(dataUrl);
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''));
  }

  async function handleGenerate() {
    if (!imageDataUrl) {
      addToast({ message: 'Please add an image first.', variant: 'error' });
      return;
    }
    if (!name.trim()) {
      addToast({ message: 'Please name this prompt instance.', variant: 'error' });
      return;
    }

    try {
      setBusy(true);
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), imageBase64: imageDataUrl }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Failed to generate.');

      const entry: Prompt = {
        id: crypto.randomUUID(),
        title: j.name || name.trim(),
        author: 'You',
        description: j.prompt,
        imageUrl: imageDataUrl,
        favorite: false,
        createdAt: new Date().toISOString(),
      };

      const prev: Prompt[] = JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
      prev.push(entry);
      localStorage.setItem(SAVE_KEY, JSON.stringify(prev));
      localStorage.setItem(SWITCH_FLAG_KEY, '1');

      addToast({
        message: `“${entry.title}” saved to your Prompt Library ✅`,
        variant: 'success',
        actionLabel: 'View',
        onAction: () => {
          localStorage.setItem(SWITCH_FLAG_KEY, '1');
          window.location.href = '/inspiration';
        },
      });

      setImageDataUrl(null);
      setName('');
      setTimeout(() => window.dispatchEvent(new Event('storage')), 200);
    } catch (e: any) {
      addToast({
        message: e?.message || 'Couldn’t generate prompt. Please try again.',
        variant: 'error',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Desktop drag & drop */}
      <div
        onDragEnter={prevent}
        onDragOver={prevent}
        onDrop={onDrop}
        className="hidden md:flex w-[480px] flex-col gap-3 rounded-2xl border border-dashed border-neutral-300 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Create from image</div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>

        <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
          Drag & drop an image (JPG/PNG/GIF/SVG/TIFF) here.
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pickFile}
        />
      </div>

      {/* Mobile: Photos + Camera */}
      <div className="flex gap-2 md:hidden">
        <button
          type="button"
          onClick={() => photosInputRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-800"
        >
          <ImagePlus className="h-4 w-4" />
          Add from Photos
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-800"
        >
          <Camera className="h-4 w-4" />
          Use Camera
        </button>

        <input
          ref={photosInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pickFile}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={pickFile}
        />
      </div>

      {/* Preview + Name + CTA */}
      {imageDataUrl && (
        <div className="flex items-start gap-3">
          <div className="relative h-20 w-28 overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageDataUrl} alt="queued" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name this prompt…"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Generate Prompt
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => { setImageDataUrl(null); setName(''); }}
                className="rounded-full px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {!imageDataUrl && (
        <p className="text-xs text-neutral-500 md:w-[480px]">
          On desktop, drag & drop or upload. On mobile, pick a photo or use the camera.
        </p>
      )}
    </div>
  );
}