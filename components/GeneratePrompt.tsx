'use client';
import { useCallback, useRef, useState } from 'react';

export function GeneratePromptCTA() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm hover:shadow transition">
        + Generate prompt
      </button>
      {open && <GenerateModal onClose={() => setOpen(false)} />}
    </>
  );
}

function GenerateModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0]; if (file) handleFile(file);
  }, []);

  function handleFile(file: File) {
    // TODO: send to /api/generate-prompt
    console.log('selected file', file);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-14 mx-auto max-w-xl rounded-2xl bg-white shadow-xl border overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generate prompt</h3>
          <button onClick={onClose} className="text-sm px-3 py-1.5 rounded-lg border">Close</button>
        </div>
        <div className="px-4 pb-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={"rounded-2xl border-dashed border-2 p-6 text-center transition " + (dragOver ? "border-spectral-500 bg-spectral-500/5" : "border-neutral-300")}
          >
            <p className="text-sm text-neutral-600">Drag & drop an image here</p>
            <div className="mt-3 flex gap-2 justify-center">
              <button onClick={() => inputRef.current?.click()} className="px-3 py-1.5 text-sm rounded-lg border">Choose image</button>
              <button onClick={() => cameraRef.current?.click()} className="px-3 py-1.5 text-sm rounded-lg border">Use camera</button>
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
          <p className="text-xs text-neutral-500 mt-3">Mobile supports photo library and camera; desktop supports file picker and drag & drop.</p>
        </div>
      </div>
    </div>
  );
}
