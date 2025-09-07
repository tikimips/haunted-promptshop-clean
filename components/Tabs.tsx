'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const tabs = [
  { href: '/inspiration', label: 'Inspiration' },
  { href: '/library', label: 'Library' },
];

export default function Tabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary tabs" className="border-b">
      <ul className="-mb-px flex gap-4">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-t-md px-3 py-2 text-sm',
                  'border-b-2 transition-colors',
                  active
                    ? 'border-black font-semibold text-black'
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
