import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import PrelineScript from "@/components/PrelineScript";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIHCE WEB",
  description: "Creado Andres Franco Robles Oliveros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        {children}
        <Toaster position="top-right" richColors />
        </body>
      <PrelineScript />
     
    </html>
    </AuthProvider>
  );
}
