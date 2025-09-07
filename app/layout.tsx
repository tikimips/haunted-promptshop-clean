// app/layout.tsx
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Promptshop",
  description: "Prompt inspiration and library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900">
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <a href="/" className="font-semibold">Promptshop</a>
            <nav className="flex gap-4 text-sm">
              <a className="hover:underline" href="/inspiration">Inspiration</a>
              <a className="hover:underline" href="/library">Prompt Library</a>
            </nav>
          </div>
        </header>

        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}