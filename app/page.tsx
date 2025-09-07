import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Welcome to Haunted Promptshop</h1>
      <p className="mt-2 text-neutral-600">Browse the feed, generate prompts from images, and build your library.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/inspiration" className="rounded-lg bg-black px-4 py-2 text-white">Open Inspiration</Link>
        <Link href="/library" className="rounded-lg border px-4 py-2">Open Prompt Library</Link>
      </div>
    </div>
  );
}