import "./globals.css";
import type { Metadata } from "next";
import Providers from "./Providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Promptshop",
  description: "Generate and save prompts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}