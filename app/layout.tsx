import "./globals.css";
import Provider from "./auth/Provider";
import Header from "@/components/Header";

export const metadata = {
  title: "Haunted Promptshop",
  description: "Generate and save high-quality prompts from images.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="min-h-full text-neutral-900">
        <Provider>
          <Header />
          {children}
          <div id="toaster-root" />
        </Provider>
      </body>
    </html>
  );
}