"use client";

import { useRef, useState } from "react";
import { ImageIcon, Camera, Loader2 } from "lucide-react";
import type { Prompt } from "@/app/types";

type Props = {
  onSaved?: (p: Prompt) => void;
};

export default function GeneratePrompt({ onSaved }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const name = prompt("Name this prompt (optional):") || "Untitled";
      const form = new FormData();
      form.append("file", file);
      form.append("name", name);

      const resp = await fetch("/api/generate-prompt", { method: "POST", body: form });
      if (!resp.ok) throw new Error("Failed to generate prompt");
      const p: Prompt = await resp.json();
      onSaved?.(p);
      alert(`Saved to Prompt Library as “${p.title}”`);
    } catch (e) {
      console.error(e);
      alert("Sorry — couldn't generate a prompt.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-neutral-300 p-5">
      <div className="flex flex-col items-center text-center">
        <ImageIcon className="h-8 w-8 text-neutral-500" />
        <p className="mt-2 text-sm text-neutral-600">
          Drag an image here, or click to upload. (JPG/PNG/GIF/SVG/TIFF)
        </p>

        <div className="mt-3 flex gap-2">
          <button
            className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Camera className="h-4 w-4" />
            Upload Image
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {loading && (
          <div className="mt-3 flex items-center gap-2 text-sm text-neutral-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating prompt…
          </div>
        )}
      </div>
    </div>
  );
}