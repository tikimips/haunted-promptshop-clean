// components/AuthButtons.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-xs text-neutral-500">…</span>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-700">
        {session.user?.name ?? session.user?.email}
      </span>
      <button
        onClick={() => signOut()}
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
      >
        Sign out
      </button>
    </div>
  );
}