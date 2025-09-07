// components/Tabs.tsx
import React from "react";

export type Tab = {
  value: string;
  label: string;
};

type Props = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
};

export function Tabs({ tabs, value, onChange }: Props) {
  return (
    <div className="flex gap-4 border-b border-neutral-200 mb-6">
      {tabs.map((t) => (
        <button
          key={t.value}
          className={`pb-2 ${
            value === t.value
              ? "border-b-2 border-black font-semibold"
              : "text-neutral-500"
          }`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}