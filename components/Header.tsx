// components/Header.tsx
"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          Promptshop
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/inspiration" className="text-sm text-neutral-700 hover:underline">
            Inspiration
          </Link>
          <Link href="/library" className="text-sm text-neutral-700 hover:underline">
            Library
          </Link>

          {status === "loading" ? (
            <span className="text-sm text-neutral-500">…</span>
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-700">
                {session.user.name ?? "Signed in"}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-neutral-900 px-3 py-1 text-sm text-white hover:bg-neutral-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-md bg-neutral-900 px-3 py-1 text-sm text-white hover:bg-neutral-800"
            >
              Continue with Google
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}