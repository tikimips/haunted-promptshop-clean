// components/Tabs.tsx
"use client";

export default function Tabs({
  active,
  onChange,
  labels = ["All", "Prompt Library"],
}: {
  active: "all" | "mine";
  onChange: (v: "all" | "mine") => void;
  labels?: [string, string] | string[];
}) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <button
        onClick={() => onChange("all")}
        className={`rounded-full px-3 py-1 text-sm ${active === "all" ? "bg-black text-white" : "bg-neutral-100"}`}
      >
        {labels[0] ?? "All"}
      </button>
      <button
        onClick={() => onChange("mine")}
        className={`rounded-full px-3 py-1 text-sm ${active === "mine" ? "bg-black text-white" : "bg-neutral-100"}`}
      >
        {labels[1] ?? "Prompt Library"}
      </button>
    </div>
  );
}