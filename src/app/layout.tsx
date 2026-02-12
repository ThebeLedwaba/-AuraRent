import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuraRent | Premium Smart Rental SaaS",
  description: "Modern property discovery and management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <footer className="py-8 border-t border-border/40 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} SmartRental System. All rights reserved.</p>
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
