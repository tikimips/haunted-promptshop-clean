// app/layout.tsx
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Promptshop",
  description: "Inspiration feed + prompt library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}