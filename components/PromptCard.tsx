import React from "react";

type PromptCardProps = {
  title?: string;
  author?: string;
  description?: string;
};

export default function PromptCard({
  title = "Untitled Prompt",
  author = "Anonymous",
  description = "No description provided.",
}: PromptCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">by {author}</p>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
      <div className="mt-3 flex gap-2">
        <button className="rounded-lg bg-indigo-500 px-3 py-1 text-white text-sm hover:bg-indigo-600">
          Generate Prompt
        </button>
        <button className="rounded-lg border px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
          Open
        </button>
      </div>
    </div>
  );
}
