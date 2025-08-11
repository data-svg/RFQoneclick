import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "RFQ SQS — Auto‑Invite MVP" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en"><body>
      <nav className="w-full border-b bg-white/80 backdrop-blur">
        <div className="container flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-semibold">RFQ SQS</Link>
          <div className="flex gap-3 text-sm">
            <Link className="hover:underline" href="/rfqs/new">New RFQ</Link>
            <Link className="hover:underline" href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>
      <main className="container">{children}</main>
    </body></html>
  );
}
