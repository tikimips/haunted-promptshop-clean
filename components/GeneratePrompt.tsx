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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const resp = await fetch("/api/generate-prompt", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) throw new Error("Failed to generate prompt");

      const prompt: Prompt = await resp.json();
      if (onSaved) onSaved(prompt);
    } catch (err) {
      console.error(err);
      alert("Error generating prompt");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 p-6 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      ) : (
        <>
          <ImageIcon className="h-8 w-8 text-neutral-500" />
          <p className="mt-2 text-sm text-neutral-600">
            Drop an image or click below to generate a prompt
          </p>
          <button
            className="mt-3 flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            Upload Image
          </button>
        </>
      )}
    </div>
  );
}