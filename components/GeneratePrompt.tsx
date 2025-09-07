// components/GeneratePrompt.tsx
"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Prompt } from "@/app/types";

type Props = { onSaved?: (p: Prompt) => void };

export default function GeneratePrompt({ onSaved }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleGenerate() {
    if (!file) {
      toast.error("Add an image first.");
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("name", name || "Untitled");

      const res = await fetch("/api/generate-prompt", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to generate.");

      const saved: Prompt = data.prompt;
      toast.success(`Saved “${saved.title}” to your library`);
      setName("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onSaved?.(saved);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate prompt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-8 rounded-xl border bg-white p-4">
      <h3 className="mb-2 font-medium">+ Generate Prompt</h3>
      <p className="mb-3 text-sm text-neutral-600">
        Drag &amp; drop an image or choose a file, give it a name, then click <b>Generate Prompt</b>.
        We’ll analyze the image with OpenAI and save it to your Prompt Library.
      </p>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-64 cursor-pointer text-sm file:mr-3 file:rounded-md file:border file:bg-white file:px-3 file:py-2"
          />
        </div>

        <input
          type="text"
          placeholder="Name this prompt (e.g., 'Isometric dashboard')"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        <button
          disabled={busy}
          onClick={handleGenerate}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Generating…" : "Generate Prompt"}
        </button>
      </div>
    </section>
  );
}