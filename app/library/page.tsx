import Tabs from '@/components/Tabs';
// If/when you render cards, switch this on and pass real data:
// import PromptCard from '@/components/PromptCard';

export default function LibraryPage() {
  return (
    <>
      <Tabs />
      <div className="p-6">
        {/* Render saved prompts here */}
        <p className="text-sm text-gray-600">Your Library is empty (for now).</p>
      </div>
    </>
  );
}
