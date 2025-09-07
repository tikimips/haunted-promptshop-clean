"use client";

import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import GeneratePrompt from "@/components/GeneratePrompt";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid from "@/components/PromptGrid";
import type { Prompt } from "@/app/types";

export default function InspirationPage() {
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  useEffect(() => {
    const m = JSON.parse(localStorage.getItem("mine") || "[]") as Prompt[];
    setMine(m);
  }, []);

  const handleSaved = useCallback((p: Prompt) => {
    setMine((prev) => [p, ...prev]);
    setTab("mine");
  }, []);

  const handleSave = useCallback((p: Prompt) => {
    const updated = [p, ...mine.filter((x) => x.id !== p.id)];
    localStorage.setItem("mine", JSON.stringify(updated));
    setMine(updated);
    toast.success("Saved to your Library");
  }, [mine]);

  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = mine.map((x) => (x.id === p.id ? { ...x, favorite: !x.favorite } : x));
    localStorage.setItem("mine", JSON.stringify(updated));
    setMine(updated);
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Toaster containerId="toaster-root" />
      <div className="mb-6 flex items-center gap-2">
        <button
          className={`rounded-md border px-3 py-1.5 text-sm ${tab === "all" ? "bg-black text-white" : "hover:bg-neutral-50"}`}
          onClick={() => setTab("all")}
        >
          All
        </button>
        <button
          className={`rounded-md border px-3 py-1.5 text-sm ${tab === "mine" ? "bg-black text-white" : "hover:bg-neutral-50"}`}
          onClick={() => setTab("mine")}
        >
          Prompt Library
        </button>
      </div>

      <GeneratePrompt onSaved={handleSaved} />

      <h1 className="mt-10 mb-4 text-2xl font-bold">Inspiration</h1>

      {tab === "all" ? (
        <InfiniteFeed onSave={handleSave} onToggleFavorite={handleToggleFavorite} />
      ) : mine.length ? (
        <PromptGrid items={mine} onSave={handleSave} onToggleFavorite={handleToggleFavorite} />
      ) : (
        <p className="py-10 text-center text-neutral-500">Nothing saved yet.</p>
      )}
    </main>
  );
}