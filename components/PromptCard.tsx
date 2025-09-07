import Image from 'next/image';

export type Prompt = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl?: string;
};

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div className="overflow-hidden rounded-xl border shadow-sm">
      {prompt.imageUrl && (
        <div className="relative h-56 w-full">
          <Image
            src={prompt.imageUrl}
            alt={prompt.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{prompt.title}</h3>
        <p className="text-sm text-gray-600">{prompt.author}</p>
        <p className="mt-2 text-sm text-gray-700">{prompt.description}</p>
      </div>
    </div>
  );
}
