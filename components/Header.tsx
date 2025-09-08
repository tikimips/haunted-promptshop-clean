"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">
            haunted-promptshop
          </Link>
          <nav className="hidden gap-4 sm:flex">
            <Link href="/inspiration" className="text-sm text-neutral-700 hover:text-black">
              Inspiration
            </Link>
            <Link href="/library" className="text-sm text-neutral-700 hover:text-black">
              Library
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <span className="hidden text-sm text-neutral-700 sm:inline">
                {session.user?.email || session.user?.name || "Signed in"}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}