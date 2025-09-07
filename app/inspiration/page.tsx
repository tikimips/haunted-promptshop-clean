// app/inspiration/page.tsx
import InfiniteFeed from '@/components/InfiniteFeed';

export const dynamic = 'force-dynamic';

export default function InspirationPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inspiration</h1>
        {/* If you still have a global "Generate Prompt" action, keep it here */}
      </header>

      {/* If you keep your DraftPrompt / Tabs / Mine, render them above the feed */}
      {/* <DraftPromptBar /> */}
      {/* <Tabs ... /> */}

      {/* Always-on imagery feed */}
      <InfiniteFeed />
    </main>
  );
}
