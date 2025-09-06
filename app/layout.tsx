import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <div className="font-semibold tracking-tight">Haunted</div>
            <nav className="text-sm text-neutral-600">promptshop.ai</nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl p-4">{children}</main>
      </body>
    </html>
  );
}
