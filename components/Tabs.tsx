'use client';

import { useState } from 'react';

type TabDef = {
  name: string;
  content: React.ReactNode;
};

export default function Tabs({ tabs }: { tabs: TabDef[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-2 border-b border-neutral-200 mb-4">
        {tabs.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            className={`px-3 py-2 text-sm rounded-t-lg transition
              ${i === active ? 'font-semibold border-b-2 border-black' : 'text-neutral-500 hover:text-black'}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div>{tabs[active]?.content}</div>
    </div>
  );
}
