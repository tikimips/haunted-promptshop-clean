import "./globals.css";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export const metadata = { title: "Haunted Promptshop", description: "Inspiration & Prompt Library" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold">Haunted Promptshop</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/inspiration" className="hover:underline">Inspiration</Link>
              <Link href="/library" className="hover:underline">Prompt Library</Link>
              <AuthButtons />
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

function AuthButtons() {
  // Simple client-side buttons to /api/auth/signin, /api/auth/signout
  return (
    <div className="flex items-center gap-2">
      <a href="/api/auth/signin" className="rounded-full border px-3 py-1">Sign in</a>
      <a href="/api/auth/signout" className="rounded-full border px-3 py-1">Sign out</a>
    </div>
  );
}