// components/GeneratePrompt.tsx
"use client";
import { useRef, useState } from "react";
import { ImageIcon, Camera, Loader2 } from "lucide-react";
import type { Prompt } from "./PromptGrid";

type Props = {
  onSaved?: (p: Prompt) => void;
};

export default function GeneratePrompt({ onSaved }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");

  const onPick = () => fileInputRef.current?.click();

  const onFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  const fileToDataUrl = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = () => reject(fr.error);
      fr.onload = () => resolve(String(fr.result));
      fr.readAsDataURL(f);
    });

  const generate = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);

      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: dataUrl, title: title || "Untitled" }),
      });

      if (!res.ok) throw new Error(await res.text());
      const prompt: Prompt = await res.json();

      onSaved?.(prompt); // drop it into “Prompt Library”
      setFile(null);
      setTitle("");
      alert("Prompt generated and saved to your library.");
    } catch (e) {
      console.error(e);
      alert("Failed to generate prompt. Check your OpenAI key & function logs.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">+ Generate Prompt</h2>
      </div>

      <div
        className="mt-4 rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center hover:border-neutral-400"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {!file ? (
          <div className="space-y-3">
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={onPick}
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
              >
                <span className="inline-flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Upload image
                </span>
              </button>
              <button
                type="button"
                disabled
                title="Camera (coming soon)"
                className="rounded-md border px-3 py-2 text-sm text-neutral-400"
              >
                <span className="inline-flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Use camera
                </span>
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Drag & drop JPG/PNG/GIF/SVG/TIFF or click “Upload image”
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm">Selected: <b>{file.name}</b></div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Name this prompt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={generate}
                disabled={busy}
                className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Prompt"}
              </button>
            </div>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onChange} />
    </section>
  );
}