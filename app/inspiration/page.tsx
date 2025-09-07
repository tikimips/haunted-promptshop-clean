import Tabs from '@/components/Tabs';
// If you plan to render cards, uncomment the next line when ready:
// import PromptCard from '@/components/PromptCard';

export default function InspirationPage() {
  return (
    <>
      <Tabs />
      <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Replace with real feed cards later */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">Sample card</div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">Sample card</div>
      </div>
    </>
  );
}
