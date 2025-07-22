// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Providers from "@/components/Providers/page"; 
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Third Wave Coffee",
  description: "Excellence in Coffee",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
