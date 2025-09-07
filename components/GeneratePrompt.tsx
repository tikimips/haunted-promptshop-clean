"use client";
import { useRef, useState } from "react";
import { ImageIcon, Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Prompt } from "@/app/types";

type Props = { onSaved?: (p: Prompt) => void };

export default function GeneratePrompt({ onSaved }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function onFileChange(f?: File) {
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = () => setPreview(r.result as string);
    r.readAsDataURL(f);
  }

  async function onGenerate() {
    try {
      if (!file && !note.trim()) {
        toast.error("Add an image or a note first."); return;
      }
      setBusy(true);
      const fd = new FormData();
      if (file) fd.append("file", file);
      fd.append("name", name || "Untitled");
      fd.append("note", note);

      const res = await fetch("/api/generate-prompt", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to generate");

      const p: Prompt = {
        id: `${Date.now()}`,
        title: name || "Untitled",
        author: "You",
        description: "Generated from your image",
        imageUrl: preview || "/placeholder.png",
        promptText: json.promptText,
        favorite: false,
        createdAt: new Date().toISOString(),
      };

      onSaved?.(p);
      toast.success("Prompt saved to your Library");
      setFile(null); setPreview(null); setName(""); setNote("");
    } catch (e: any) {
      toast.error(e?.message || "Generation failed");
    } finally { setBusy(false); }
  }

  return (
    <section className="rounded-2xl border bg-white p-4">
      <h2 className="mb-3 text-xl font-semibold">Generate Prompt from Image</h2>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="rounded-lg border bg-neutral-50 p-3 text-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="mx-auto aspect-video w-full rounded object-cover" />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded border border-dashed">
              <div className="flex flex-col items-center text-neutral-500">
                <ImageIcon className="mb-2 h-6 w-6" />
                <div className="text-sm">Drag & drop or upload</div>
              </div>
            </div>
          )}
          <div className="mt-3 flex justify-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileChange(e.target.files?.[0] || undefined)}
            />
            <button onClick={() => inputRef.current?.click()} className="rounded border px-3 py-1 text-sm">Upload</button>
            <button
              onClick={async () => {
                // mobile camera capture
                const el = document.createElement("input");
                el.type = "file";
                el.accept = "image/*";
                el.capture = "environment";
                el.onchange = (e: any) => onFileChange(e.target.files?.[0] || undefined);
                el.click();
              }}
              className="flex items-center gap-1 rounded border px-3 py-1 text-sm"
            >
              <Camera className="h-4 w-4" /> Camera
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name this prompt"
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional notes to guide the analysis"
            className="h-28 w-full rounded border px-3 py-2"
          />
          <div className="flex justify-end">
            <button
              onClick={onGenerate}
              disabled={busy}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Generate Prompt
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            We’ll analyze the image with OpenAI and save the result to your Prompt Library.
          </p>
        </div>
      </div>
    </section>
  );
}