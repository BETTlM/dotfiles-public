import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.canonicalUrl),
  title: "Config Portal | Chaos Dotfiles",
  description:
    "A public stash of sanitized setup files. Pull one config or the full bundle and stay locked in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body id="top">
        <header className="topNav">
          <Link href="/" className="brand">
            <span className="brandMark">~/</span>
            <span className="brandText">configs</span>
          </Link>
          <nav>
            <Link href="/#top" className="navLink">
              Catalog
            </Link>
            <Link href="/download/bundle" className="navLink">
              Bundle
            </Link>
            <Link
              href="https://github.com/BETTlM"
              target="_blank"
              rel="noopener noreferrer"
              className="navLink"
            >
              GitHub
            </Link>
            <Link href="/admin" className="navLink cta">
              Admin
            </Link>
          </nav>
        </header>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
