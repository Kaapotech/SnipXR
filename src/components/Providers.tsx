'use client';

import { SessionProvider } from "next-auth/react";
import ClaimLinks from "@/components/ClaimLinks";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ClaimLinks />
      {children}
    </SessionProvider>
  );
}
