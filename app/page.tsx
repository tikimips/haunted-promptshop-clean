import Link from "next/link";

// Disable SSG here so build doesn’t attempt to evaluate client contexts.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Welcome</h1>
      <p className="mb-6 text-neutral-700">
        Jump right in:
      </p>
      <div className="flex gap-3">
        <Link
          href="/inspiration"
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          Inspiration
        </Link>
        <Link
          href="/library"
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          Library
        </Link>
      </div>
    </main>
  );
}