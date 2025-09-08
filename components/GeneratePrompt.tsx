// components/GeneratePrompt.tsx
"use client";

import { useRef, useState } from "react";
import { Loader2, ImageIcon, Camera } from "lucide-react";
import toast from "react-hot-toast";
import type { Prompt } from "@/app/types";

type Props = { onSaved?: (p: Prompt) => void };

export default function GeneratePrompt({ onSaved }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function onGenerate() {
    if (!file) return toast.error("Choose an image first.");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("name", name || "Untitled");
      const res = await fetch("/api/generate-prompt", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const p: Prompt = await res.json();
      onSaved?.(p);
      toast.success("Saved to your library.");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-6 rounded-2xl border bg-white p-4">
      <h2 className="mb-2 text-sm font-semibold">Generate Prompt</h2>
      <p className="mb-3 text-xs text-neutral-500">
        Drag & drop an image or choose a file, give it a name, then click Generate Prompt.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
          >
            <ImageIcon className="mr-2 inline h-4 w-4" />
            Choose image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <span className="text-xs text-neutral-600">{file?.name ?? "JPG, PNG, GIF, SVG, TIFF"}</span>
        </div>

        <input
          className="flex-1 rounded-md border px-3 py-1.5 text-sm"
          placeholder="Name this prompt (e.g., "Isometric dashboard")"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={onGenerate}
          disabled={busy}
          className="inline-flex items-center justify-center rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
          Generate Prompt
        </button>
      </div>
    </section>
  );
}