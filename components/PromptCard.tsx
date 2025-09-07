type PromptCardProps = {
  title: string;
  author: string;
  image: string;
};

export default function PromptCard({ title, author, image }: PromptCardProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      {/* Image */}
      <div className="aspect-video bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">by {author}</p>

        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1 text-sm rounded-lg border hover:bg-gray-50">
            Generate Prompt
          </button>
          <button className="px-3 py-1 text-sm rounded-lg border hover:bg-gray-50">
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
