'use client'

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
  session?: any; // Ajusta el tipo según corresponda
}
export default function AuthProvider({children,...session}:Props) {
  return (
    <SessionProvider {...session}>
      {children}
    </SessionProvider>
  );
}