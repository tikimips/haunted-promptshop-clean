// components/PromptCard.tsx

type Prompt = {
  id?: string | number;
  title: string;
  author?: string;
  description?: string;
  imageUrl?: string;
};

type PropsNew = { prompt: Prompt };
type PropsLegacy = {
  id?: string | number;
  title: string;
  author?: string;
  description?: string;
  imageUrl?: string;
};

function hasPromptProp(
  props: PropsNew | PropsLegacy
): props is PropsNew {
  // Narrowing guard: new API passes a single "prompt" prop
  return (props as PropsNew).prompt !== undefined;
}

export default function PromptCard(props: PropsNew | PropsLegacy) {
  // Normalize to a single "prompt" object so the rest of the component
  // doesn’t care which prop style was used.
  const p: Prompt = hasPromptProp(props)
    ? props.prompt
    : {
        id: props.id,
        title: props.title ?? "Untitled prompt",
        author: props.author,
        description: props.description,
        imageUrl: props.imageUrl,
      };

  return (
    <div className="rounded-xl border border-neutral-200 p-4 hover:shadow-md transition">
      {/* Thumbnail */}
      {p.imageUrl ? (
        <div className="h-36 w-full rounded-lg bg-neutral-100 mb-3 overflow-hidden">
          <img
            src={p.imageUrl}
            alt={p.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      {/* Meta */}
      <div className="text-sm text-neutral-500">by {p.author ?? "Unknown"}</div>
      <div className="font-medium text-neutral-900">{p.title}</div>
      {p.description && (
        <p className="mt-2 text-sm text-neutral-700 line-clamp-3">
          {p.description}
        </p>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button className="text-sm rounded-lg border px-3 py-1">
          Generate Prompt
        </button>
        <button className="text-sm rounded-lg border px-3 py-1">Open</button>
      </div>
    </div>
  );
}
