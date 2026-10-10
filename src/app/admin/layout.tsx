import type { Metadata, Viewport } from "next";
import { jakarta, mukta } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mukta.variable}`}>
      <body className="min-h-dvh bg-soft font-sans antialiased">{children}</body>
    </html>
  );
}
