"use client";

import { useMemo } from "react";

export type Tab = { value: string; label: string };

type Props = {
  tabs: Tab[];
  value: string;
  onChange: (v: string) => void;
};

export function Tabs({ tabs, value, onChange }: Props) {
  const map = useMemo(() => new Map(tabs.map(t => [t.value, t.label])), [tabs]);

  return (
    <div className="flex gap-2 rounded-lg bg-neutral-100 p-1 text-sm">
      {tabs.map(t => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            className={`rounded-md px-3 py-1.5 transition ${
              active ? "bg-white shadow text-black" : "text-neutral-600 hover:text-black"
            }`}
            onClick={() => onChange(t.value)}
            type="button"
          >
            {map.get(t.value)}
          </button>
        );
      })}
    </div>
  );
}