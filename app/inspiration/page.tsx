"use client";

import { useEffect, useState, useCallback } from "react";
import GeneratePrompt from "@/components/GeneratePrompt";
import InfiniteFeed from "@/components/InfiniteFeed";
import PromptGrid, { type Prompt } from "@/components/PromptGrid";
import { readMine, writeMine } from "@/lib/storage";

type TabKey = "all" | "mine";

export default function InspirationPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [mine, setMine] = useState<Prompt[]>([]);

  // Load saved prompts
  useEffect(() => {
    setMine(readMine());
  }, []);

  // Save a new prompt
  const handleSave = useCallback((p: Prompt) => {
    const updated = writeMine(p);
    setMine(updated);
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback((p: Prompt) => {
    const updated = mine.map((item) =>
      item.createdAt === p.createdAt
        ? { ...item, favorite: !item.favorite }
        : item
    );
    setMine(updated);
    localStorage.setItem("mine", JSON.stringify(updated));
  }, [mine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Page header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Inspiration</h1>
        <p className="mt-2 text-neutral-600">
          Upload an image and generate creative prompts. Save your favorites in
          your Prompt Library.
        </p>
      </header>

      {/* Generate From Image */}
      <div className="mb-10">
        <GeneratePrompt onSaved={handleSave} />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex justify-center space-x-6 border-b">
        <button
          onClick={() => setTab("all")}
          className={`pb-2 ${
            tab === "all"
              ? "border-b-2 border-black font-semibold"
              : "text-neutral-500"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setTab("mine")}
          className={`pb-2 ${
            tab === "mine"
              ? "border-b-2 border-black font-semibold"
              : "text-neutral-500"
          }`}
        >
          Prompt Library
        </button>
      </div>

      {/* Content */}
      {tab === "all" ? (
        <InfiniteFeed onSave={handleSave} onToggleFavorite={handleToggleFavorite} />
      ) : mine.length ? (
        <PromptGrid
          items={mine}
          onSave={handleSave}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <p className="py-10 text-center text-neutral-500">
          Nothing saved yet. Go to <b>Inspiration</b> and use <b>Generate Prompt</b>{" "}
          to add one.
        </p>
      )}
    </main>
  );
}