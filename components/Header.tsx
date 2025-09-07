// components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DemoUser = { name: string } | null;
const KEY = "demo-user";

export default function Header() {
  const [user, setUser] = useState<DemoUser>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const signIn = () => {
    const u = { name: "Demo User" };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };
  const signOut = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">Haunted Promptshop</Link>
        <nav className="flex items-center gap-4">
          <Link href="/inspiration" className="text-sm hover:underline">Inspiration</Link>
          <Link href="/library" className="text-sm hover:underline">Prompt Library</Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">Hi, {user.name}</span>
              <button
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
              onClick={signIn}
            >
              Continue with Google (demo)
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}