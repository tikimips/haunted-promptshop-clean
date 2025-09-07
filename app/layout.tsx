import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Haunted Promptshop",
  description: "Inspiration + Prompt Library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        <header className="border-b">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold">Haunted</Link>
            <nav className="flex items-center gap-4 text-sm text-neutral-600">
              <Link href="/inspiration" className="hover:text-black">Inspiration</Link>
              <Link href="/library" className="hover:text-black">Prompt Library</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}