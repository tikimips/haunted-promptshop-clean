"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const authed = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold tracking-tight">
            Haunted Promptshop
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-neutral-600">
            <Link href="/inspiration" className="hover:text-black">Inspiration</Link>
            <Link href="/library" className="hover:text-black">Prompt Library</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {authed ? (
            <>
              <span className="text-sm text-neutral-600 hidden sm:block">
                {session?.user?.email ?? session?.user?.name ?? "Signed in"}
              </span>
              <button
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
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