import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
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
            <span className="brandMark">cf</span>
            <span className="brandText">Config Portal</span>
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
        <footer className="footer">
          <div className="footerInner">
            <span>
              Crafted by{" "}
              <Link
                href="https://github.com/BETTlM"
                target="_blank"
                rel="noopener noreferrer"
              >
                @BETTlM
              </Link>
            </span>
            <span>
              Sanitized for public viewing, placeholders normalized, read-only for everyone else
            </span>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
