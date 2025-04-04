import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BSO Portal",
  description: "Create and share personalized link portals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col justify-between">
            <div>
              <Header />
              {children}
            </div>

            <footer className="border-t py-6">
              <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  &copy; {new Date().getFullYear()} BSO Portal. All rights reserved.
                </p>
                <div className="flex gap-4">
                  <Link href="/about" className="text-sm text-muted-foreground hover:underline">
                    About
                  </Link>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                    Terms
                  </Link>
                </div>
              </div>
            </footer>
          </div>

          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
