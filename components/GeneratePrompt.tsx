// components/GeneratePrompt.tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Prompt } from "@/app/types";

const STORAGE_KEY = "ps:mine";

function readMine(): Prompt[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeMine(items: Prompt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function GeneratePrompt() {
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleGenerate() {
    if (!file || !fileUrl) return;

    const name = nameRef.current?.value?.trim() || file.name || "Untitled";
    setLoading(true);

    // Call our API route
    const res = await fetch("/api/generate-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Failed to generate prompt.");
      return;
    }

    const data = await res.json() as { prompt: string; createdAt: string };

    const entry: Prompt = {
      id: crypto.randomUUID(),
      name,
      prompt: data.prompt || "",
      imageUrl: fileUrl,
      favorite: false,
      createdAt: data.createdAt,
    };

    const mine = readMine();
    writeMine([entry, ...mine]);

    toast.success("Prompt generated & saved to your Prompt Library!");

    // reset input
    setFile(null);
    if (nameRef.current) nameRef.current.value = "";
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  return (
    <div className="mb-8 rounded-xl border border-neutral-200 p-4">
      <h2 className="mb-2 text-lg font-semibold">+ Generate Prompt</h2>
      <p className="mb-3 text-sm text-neutral-600">
        Drag & drop an image or choose a file, give it a name, then click <b>Generate Prompt</b>.
        We’ll analyze the image with OpenAI and save it to your Prompt Library.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="col-span-2 rounded-lg border border-dashed p-4 text-sm">
          <label htmlFor={inputId} className="block cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="rounded bg-neutral-100 px-2 py-1 text-xs">Choose Image</div>
              <span className="text-neutral-600">JPG, PNG, GIF, SVG, TIFF</span>
            </div>
          </label>
          <input id={inputId} type="file" accept="image/*" className="hidden" onChange={onPick} />
          {fileUrl && (
            <div className="mt-3">
              <img src={fileUrl} alt="selected" className="h-28 w-28 rounded object-cover" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={nameRef}
            type="text"
            placeholder="Name this prompt (e.g., 'Isometric dashboard')"
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring"
          />
          <button
            disabled={!file || loading}
            onClick={handleGenerate}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}