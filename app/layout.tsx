// app/layout.tsx
import "./styles/globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Promptshop",
  description: "Generate, save and browse prompts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-neutral-900">
        {/* Auth & other client providers MUST wrap children on the client */}
        <Providers>
          <Header />
          <div className="mx-auto w-full max-w-6xl px-4 py-6">{children}</div>
        </Providers>
      </body>
    </html>
  );
}