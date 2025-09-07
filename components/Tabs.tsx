// components/Tabs.tsx
"use client";
import { useState, useId, KeyboardEvent } from "react";

type Tab = { name: string; content: React.ReactNode };

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const groupId = useId();

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight") {
      setActive((i) => (i + 1) % tabs.length);
    } else if (e.key === "ArrowLeft") {
      setActive((i) => (i - 1 + tabs.length) % tabs.length);
    }
  };

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex gap-4 border-b border-neutral-200"
      >
        {tabs.map((t, i) => (
          <button
            key={`${groupId}-${i}`}
            role="tab"
            aria-selected={active === i}
            aria-controls={`${groupId}-panel-${i}`}
            id={`${groupId}-tab-${i}`}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className={[
              "relative -mb-px px-3 py-2 text-sm transition",
              active === i
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800",
            ].join(" ")}
          >
            {t.name}
            <span
              className={[
                "absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full",
                active === i ? "bg-neutral-900" : "bg-transparent",
              ].join(" ")}
            />
          </button>
        ))}
      </div>

      <div className="pt-6">
        {tabs.map((t, i) => (
          <div
            key={`${groupId}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${groupId}-tab-${i}`}
            id={`${groupId}-panel-${i}`}
            hidden={active !== i}
          >
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
