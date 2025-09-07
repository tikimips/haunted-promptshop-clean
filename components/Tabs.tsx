// components/Tabs.tsx
"use client";

import clsx from "clsx";

export type Tab = { value: "all" | "mine"; label: string };

type Props = {
  tabs: Tab[];
  value: Tab["value"];
  onChange: (value: Tab["value"]) => void;
};

export default function Tabs({ tabs, value, onChange }: Props) {
  return (
    <div className="mt-6 flex gap-2">
      {tabs.map((t) => (
        <button
          key={t.value}
          className={clsx(
            "rounded-full px-4 py-1.5 text-sm",
            value === t.value ? "bg-black text-white" : "bg-neutral-100 hover:bg-neutral-200"
          )}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}