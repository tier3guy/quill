import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/extended/Navbar";
import TrpcProvider from "@/providers/TrpcProvider";
import { Toaster } from "@/components/ui/toaster";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quill",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <TrpcProvider>
        <html lang="en">
          <body
            className={cn("min-h-screen antialiased grainy", inter.className)}
          >
            <Navbar />
            {children}
            <Toaster />
          </body>
        </html>
      </TrpcProvider>
    </ClerkProvider>
  );
}
