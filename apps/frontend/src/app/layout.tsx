import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Industrial AI Dashboard",
  description: "Full-stack + MLOps + GenAI demo",
};

export default function RootLayout({ children,} : { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <header className="w-full border-b bg-white">
          <nav className="mx-auto max-w-6xl flex items-center justify-between p-4">
            <div className="font-semibold">Industrial AI Dashboard</div>
            <div className="flex gap-5 text-sm">
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/login">Login</Link>
              <LogoutButton />
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
