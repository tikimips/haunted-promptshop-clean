// components/Header.tsx
"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-semibold">Promptshop</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/inspiration" className="hover:underline">Inspiration</Link>
          <Link href="/library" className="hover:underline">Prompt Library</Link>
        </nav>
      </div>
    </header>
  );
}