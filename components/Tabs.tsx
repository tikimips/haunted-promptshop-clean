'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const TABS = [
  { href: '/inspiration', label: 'Inspiration' },
  { href: '/library', label: 'Library' },
];
export function Tabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-2 mb-4 border-b">
      {TABS.map(t => {
        const active = pathname?.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href}
            className={"px-3 py-2 -mb-px border-b-2 " + (active ? "border-spectral-500 font-medium" : "border-transparent text-neutral-500")}>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
