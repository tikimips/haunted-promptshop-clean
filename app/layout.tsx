import AuthButtons from '@/components/AuthButtons';
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <div className="font-semibold tracking-tight">Promptshop</div>
            <AuthButtons />
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-4xl p-4">{children}</main>
      </body>
    </html>
  );
}
