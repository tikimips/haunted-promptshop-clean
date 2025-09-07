// components/Tabs.tsx
"use client";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
};

export default function Tabs({ tabs, value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-full border px-3 py-1 text-sm ${
              active
                ? "border-black bg-black text-white"
                : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}