'use client';

import { useState } from 'react';

export default function GeneratePrompt() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function onGenerate() {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send whatever you want the model to riff on.
          // For now, we pass the user's text straight through.
          prompt: `Generate a high-quality image prompt in the style described here. 
Return only the prompt, no preface:\n\n${input}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      // OpenAI chat response shape (gpt-4o-mini)
      const content =
        data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.message ??
        JSON.stringify(data);

      setResult(typeof content === 'string' ? content.trim() : String(content));
    } catch (e: any) {
      setError(e?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  function onCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">+ Generate Prompt</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Describe the style you want (or paste notes). Click Generate to fetch a prompt from the API.
      </p>

      <textarea
        className="mt-4 w-full rounded-xl border border-neutral-300 p-3 outline-none focus:border-neutral-400"
        rows={5}
        placeholder="e.g. sleek dashboard UI, glassmorphism, soft shadows, minimalist color, editorial layout…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onGenerate}
          disabled={isLoading || !input.trim()}
          className="rounded-xl border border-neutral-200 bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? 'Generating…' : 'Generate'}
        </button>

        {result && (
          <button
            onClick={onCopy}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm hover:bg-neutral-50"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="text-xs uppercase tracking-wide text-neutral-500">Generated prompt</div>
          <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-neutral-800">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
