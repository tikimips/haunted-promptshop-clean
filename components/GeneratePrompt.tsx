"use client";

import { useMemo, useRef, useState } from "react";
import { ImageIcon, Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Prompt } from "@/app/types";

type Props = {
  onSaved?: (p: Prompt) => void;
};

export default function GeneratePrompt({ onSaved }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const disabled = useMemo(() => !file || !title || busy, [file, title, busy]);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onGenerate() {
    try {
      setBusy(true);
      const fd = new FormData();
      if (file) fd.append("image", file);
      fd.append("title", title);
      fd.append("notes", notes);

      const res = await fetch("/api/generate-prompt", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");

      const promptText: string = data.promptText;

      const newItem: Prompt = {
        id: crypto.randomUUID(),
        title,
        author: "You",
        description: "Generated from your image.",
        imageUrl: preview,
        promptText,
        favorite: false,
        createdAt: new Date().toISOString(),
      };

      // local save
      const prev = JSON.parse(localStorage.getItem("mine") || "[]") as Prompt[];
      const updated = [newItem, ...prev];
      localStorage.setItem("mine", JSON.stringify(updated));
      onSaved?.(newItem);

      toast.success("Prompt saved to your Library");
      setTitle("");
      setNotes("");
      setFile(null);
      setPreview("");
    } catch (e: any) {
      toast.error(e?.message || "Unable to generate prompt");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border p-4 sm:p-5">
      <h2 className="text-lg font-semibold mb-3">Generate Prompt from Image</h2>

      <div className="grid gap-4 sm:grid-cols-[1fr,260px]">
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name this prompt…"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ring-neutral-200"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes to guide the prompt…"
            rows={4}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ring-neutral-200"
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
              onClick={() => fileRef.current?.click()}
            >
              <ImageIcon className="size-4" />
              Add image
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-neutral-50 sm:hidden"
              onClick={() => fileRef.current?.click()}
              aria-label="Use camera (mobile)"
            >
              <Camera className="size-4" />
              Use camera
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onPickFile}
            />
          </div>
          <div>
            <button
              onClick={onGenerate}
              disabled={disabled}
              className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Generate Prompt
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="max-h-48 rounded-lg border object-contain" />
          ) : (
            <div className="h-48 w-full rounded-lg border text-sm text-neutral-500 grid place-content-center">
              Image preview
            </div>
          )}
        </div>
      </div>
    </section>
  );
}