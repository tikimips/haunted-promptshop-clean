"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Promptshop
          </Link>
          <nav className="hidden gap-4 sm:flex">
            <Link href="/inspiration" className="text-sm text-neutral-700 hover:underline">
              Inspiration
            </Link>
            <Link href="/library" className="text-sm text-neutral-700 hover:underline">
              Library
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <span className="text-sm text-neutral-500">…</span>
          ) : session ? (
            <>
              <span className="hidden text-sm text-neutral-600 sm:inline">
                {session.user?.email || session.user?.name}
              </span>
              <button
                className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}