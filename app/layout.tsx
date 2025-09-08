import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

export const metadata = {
  title: "haunted-promptshop",
  description: "Prompt inspiration and library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // NOTE: layout.tsx is a Server Component, but we safely include Client Components
  // (Providers, Header) inside it. They render on the client and won’t break prerender.
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}