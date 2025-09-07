// components/Header.tsx
"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">Haunted Promptshop</Link>

        <nav className="flex items-center gap-4">
          <Link href="/inspiration" className="text-sm hover:underline">Inspiration</Link>
          <Link href="/library" className="text-sm hover:underline">Prompt Library</Link>
          {/* Placeholder auth buttons so UI is back; swap with real auth later */}
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
            onClick={() => alert("Hook up Google OAuth later. This is a placeholder button.")}
          >
            Continue with Google
          </button>
        </nav>
      </div>
    </header>
  );
}