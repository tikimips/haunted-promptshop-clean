import Image from "next/image";
import { useCallback, useState } from "react";
import type { Prompt } from "@/app/types";

type Props = {
  prompt: Prompt;
  onCopy?: (p: Prompt) => void;
  onSave?: (p: Prompt) => void;
  onToggleFavorite?: (p: Prompt) => void;
};

export default function PromptCard({
  prompt,
  onCopy,
  onSave,
  onToggleFavorite,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (prompt.promptText) {
      navigator.clipboard.writeText(prompt.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(prompt);
    }
  }, [prompt, onCopy]);

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      {prompt.imageUrl && (
        <Image
          src={prompt.imageUrl}
          alt={prompt.title || "Generated prompt"}
          width={400}
          height={300}
          className="w-full object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold">{prompt.title || "Untitled Prompt"}</h3>
        <p className="mt-2 text-sm text-neutral-600">
          {prompt.description || "No description provided."}
        </p>
        {prompt.promptText && (
          <pre className="mt-3 rounded bg-neutral-100 p-2 text-xs whitespace-pre-wrap">
            {prompt.promptText}
          </pre>
        )}
        <div className="mt-3 flex space-x-2">
          <button
            onClick={handleCopy}
            className="rounded bg-neutral-200 px-2 py-1 text-xs"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => onSave?.(prompt)}
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white"
          >
            Save
          </button>
          <button
            onClick={() => onToggleFavorite?.(prompt)}
            className={`rounded px-2 py-1 text-xs ${
              prompt.favorite ? "bg-yellow-400" : "bg-neutral-200"
            }`}
          >
            {prompt.favorite ? "★" : "☆"}
          </button>
        </div>
      </div>
    </div>
  );
}