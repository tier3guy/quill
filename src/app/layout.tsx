import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/extended/Navbar";
import TrpcProvider from "@/providers/TrpcProvider";
import { Toaster } from "@/components/ui/toaster";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

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
