// components/GeneratePrompt.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Prompt } from "@/components/PromptGrid";

type Props = {
  /** Called after a prompt has been created and saved */
  onSaved: (p: Prompt) => void;
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop";

export default function GeneratePrompt({ onSaved }: Props) {
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    try {
      return URL.createObjectURL(file);
    } catch {
      return "";
    }
  }, [file]);

  const onPick = () => inputRef.current?.click();

  const onFile = (f: File | null) => {
    if (!f) return;
    if (!/^image\//.test(f.type)) {
      toast.error("Please choose an image file.");
      return;
    }
    setFile(f);
  };

  const doGenerate = useCallback(async () => {
    if (busy) return;
    setBusy(true);

    const dismiss = toast.loading("Generating…");

    try {
      // Try your API route if present; otherwise fall back to a local composition
      let generatedPrompt = "";

      try {
        const body = new FormData();
        if (notes) body.append("notes", notes);
        if (file) body.append("image", file);

        const res = await fetch("/api/generate-prompt", {
          method: "POST",
          body,
        });

        if (res.ok) {
          const data = (await res.json()) as { prompt?: string };
          generatedPrompt = (data?.prompt || "").trim();
        }
      } catch {
        // ignore network/route errors; we'll fall back
      }

      if (!generatedPrompt) {
        // Fallback composition so the UI still works even if API is not present
        generatedPrompt =
          notes?.trim() ||
          "Describe the scene and visual style. Use specific nouns, verbs, materials, and lighting. Keep it concise.";
      }

      const now = new Date().toISOString();
      const promptObj: Prompt = {
        id: `gen-${now}`,
        title: name?.trim() || "Untitled prompt",
        author: "You",
        imageUrl: previewUrl || FALLBACK_IMG,
        description: notes?.trim() || "Generated prompt",
        favorite: false,
        createdAt: now,
        prompt: generatedPrompt,
      };

      // Persist in localStorage (Prompt Library)
      try {
        const key = "promptshop:mine";
        const raw = localStorage.getItem(key);
        const list = raw ? (JSON.parse(raw) as Prompt[]) : [];
        localStorage.setItem(key, JSON.stringify([promptObj, ...list]));
      } catch {
        // ignore storage errors
      }

      onSaved(promptObj);

      toast.success("Saved to Prompt Library", { id: dismiss });
      setNotes("");
      setName("");
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate prompt.", { id: dismiss });
    } finally {
      setBusy(false);
    }
  }, [busy, file, name, notes, onSaved, previewUrl]);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm">
      <h2 className="font-medium">+ Generate Prompt</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Add notes (or paste text). Optionally include an image. Give it a name,
        then click <b>Generate Prompt</b>. We’ll analyze it (or compose from
        notes) and save it to your Prompt Library.
      </p>

      {/* uploader + name */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr,16rem]">
        <div>
          <div
            className="flex min-h-[160px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-neutral-500"
            onClick={onPick}
            role="button"
            aria-label="Pick an image"
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-40 w-full rounded-md object-contain"
              />
            ) : (
              <span>Drag & drop or click to add an image</span>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name your prompt"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            disabled={busy}
            onClick={doGenerate}
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Generating…" : "Generate Prompt"}
          </button>
        </div>
      </div>

      {/* notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. sleek dashboard UI, glassmorphism, soft shadows, minimalist color, editorial layout…"
        className="mt-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
        rows={4}
      />
    </section>
  );
}