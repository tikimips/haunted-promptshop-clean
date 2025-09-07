// app/page.tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="mt-2 text-neutral-600">
        Visit <a href="/inspiration" className="underline">Inspiration</a> to browse the feed and generate prompts,
        or <a href="/library" className="underline">Prompt Library</a> to see your saved prompts.
      </p>
    </main>
  );
}