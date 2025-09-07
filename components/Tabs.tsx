'use client';

import { useState } from 'react';

type Tab = { name: string; content: React.ReactNode };
export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {tabs.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            className={`rounded-full px-3 py-1 text-sm ${
              i === active ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
