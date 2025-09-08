// components/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* one global toaster root */}
      <Toaster />
      {children}
    </SessionProvider>
  );
}