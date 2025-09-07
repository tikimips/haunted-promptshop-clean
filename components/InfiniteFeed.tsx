// app/inspiration/page.tsx
"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid, { Prompt } from "@/components/PromptGrid";

export default function InspirationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");

  const onGenerate = async () => {
    if (!file) {
      toast.error("Add an image first.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", name || "Untitled");

      const res = await fetch("/api/generate-prompt", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json?.error ?? "Failed to generate prompt.");
        return;
      }

      const promptText: string = json.prompt;
      toast.success("Prompt saved to your library.");
      // Here you’d also persist to your DB; for demo we just log
      console.log("Generated prompt:", promptText);
      setName("");
      setFile(null);
    } catch (e: any) {
      toast.error("Failed to generate prompt.");
      console.error(e);
    }
  };

  // demo “Mine” list (empty until you wire persistence)
  const mine: Prompt[] = [];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Toaster />

      {/* Generate Prompt box */}
      <section className="mb-8 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm font-semibold">+ Generate Prompt</div>
        <p className="mb-4 text-sm text-neutral-600">
          Drop or choose an image, give it a name, then click <b>Generate Prompt</b>.
          We’ll analyze the image and save it to your Prompt Library.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-md border border-neutral-300 p-2 text-sm"
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-neutral-300 p-2 text-sm sm:max-w-xs"
          />
          <button
            onClick={onGenerate}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Generate Prompt
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
          All
        </span>
        <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs text-neutral-700">
          Prompt Library
        </span>
      </div>

      {/* Infinite feed (3 cols on desktop) */}
      <InfiniteFeed />

      {/* (Optional) “Mine” section if you want to render it here */}
      {mine.length ? (
        <>
          <h2 className="mt-12 mb-3 text-lg font-semibold">Prompt Library</h2>
          <PromptGrid prompts={mine} />
        </>
      ) : null}
    </main>
  );
}