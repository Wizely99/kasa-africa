"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export function Providers({ children, session }: Readonly<ProvidersProps>) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}