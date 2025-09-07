// components/SavePromptModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  initialName?: string;
  onCancel: () => void;
  onSave: (name: string) => void;
};

export default function SavePromptModal({ open, initialName = '', onCancel, onSave }: Props) {
  const [name, setName] = useState(initialName);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      dlg.showModal();
      // small delay to ensure focus
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (!open && dlg.open) {
      dlg.close();
    }
  }, [open]);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl p-0 w-[90vw] max-w-md backdrop:bg-black/40 backdrop:backdrop-blur"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <div className="p-5">
        <h2 className="text-lg font-semibold">Save prompt</h2>
        <p className="text-sm text-neutral-600 mt-1">Give your prompt a short, descriptive name.</p>
        <label className="block mt-4 text-sm font-medium text-neutral-700">Name</label>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Minimalist Landing Hero"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => name.trim() && onSave(name.trim())}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/90"
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
}
