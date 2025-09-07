// components/GeneratePrompt.tsx
"use client";

import { useRef, useState } from "react";
import type { Prompt } from "@/app/types";

type Props = {
  onSaved?: (p: Prompt) => void;
};

export default function GeneratePrompt({ onSaved }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const onPick = () => fileRef.current?.click();

  const onFile = (f: File | null) => {
    setFile(f);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  const generate = async () => {
    if (!file) {
      setMessage("Attach an image first.");
      setStatus("error");
      return;
    }
    setStatus("working");
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("name", name || "Untitled");
      fd.append("notes", notes);

      const res = await fetch("/api/generate-prompt", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to generate prompt");
      const data = (await res.json()) as { promptText: string };

      const imageUrl = URL.createObjectURL(file);
      const now = new Date().toISOString();
      const saved: Prompt = {
        id: `${Date.now()}`,
        title: name || "Untitled",
        author: "You",
        description: notes || "Generated from your image",
        imageUrl,
        promptText: data.promptText,
        favorite: false,
        createdAt: now,
      };

      onSaved?.(saved);
      setStatus("done");
      setMessage("✅ Prompt saved to your library.");
      setFile(null);
      setName("");
      setNotes("");
    } catch (e: any) {
      setStatus("error");
      setMessage(e?.message || "Failed to generate prompt.");
    }
  };

  return (
    <div className="mt-6 rounded-xl border p-4">
      <h2 className="mb-3 text-lg font-semibold">Generate Prompt from Image</h2>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center"
      >
        {file ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="selected"
              src={URL.createObjectURL(file)}
              className="h-32 w-48 rounded-md object-cover"
            />
            <div className="text-xs text-neutral-600">{file.name}</div>
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
              onClick={() => setFile(null)}
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <div className="text-sm text-neutral-600">
              Drag &amp; drop an image here or choose a file
            </div>
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
              onClick={onPick}
            >
              Choose File
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-600">Name</label>
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Give this prompt a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs text-neutral-600">Notes (optional)</label>
          <textarea
            className="min-h-[80px] rounded-md border px-3 py-2 text-sm"
            placeholder="What should the prompt capture?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
          disabled={!file || status === "working"}
          onClick={generate}
        >
          {status === "working" ? "Generating…" : "Generate Prompt"}
        </button>

        {message && (
          <span
            className={
              status === "error"
                ? "text-sm text-red-600"
                : status === "done"
                ? "text-sm text-green-600"
                : "text-sm text-neutral-600"
            }
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}