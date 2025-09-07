// components/Tabs.tsx
"use client";
import { useCallback } from "react";

export type Tab = { value: string; label: string };

type Props = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
};

export default function Tabs({ tabs, value, onChange }: Props) {
  const click = useCallback(
    (v: string) => () => onChange(v),
    [onChange]
  );

  return (
    <div className="flex gap-2 border-b border-neutral-200">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={click(t.value)}
            className={[
              "px-3 py-2 text-sm",
              active
                ? "border-b-2 border-black font-semibold"
                : "text-neutral-500 hover:text-black"
            ].join(" ")}
            aria-pressed={active}
            type="button"
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}