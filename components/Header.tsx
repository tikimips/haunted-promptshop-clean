// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const link = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className={`px-3 py-1 rounded-full text-sm ${
          active ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Haunted Promptshop
        </Link>
        <nav className="flex items-center gap-2">
          {link("/inspiration", "Inspiration")}
          {link("/library", "Prompt Library")}
        </nav>
      </div>
    </header>
  );
}