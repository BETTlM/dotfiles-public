import Link from "next/link";
import type { ReactNode } from "react";

import { SITE } from "@/lib/site";

interface LegalDocumentProps {
  title: string;
  subtitle?: string;
  effectiveDate: string;
  children: ReactNode;
}

export function LegalDocument({ title, subtitle, effectiveDate, children }: LegalDocumentProps) {
  return (
    <main className="container legalPage">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Stash</Link>
        <span className="sep">/</span>
        <span className="current">{title}</span>
      </nav>

      <header className="legalHeader">
        <h1 className="legalTitle">{title}</h1>
        {subtitle ? <p className="legalSubtitle">{subtitle}</p> : null}
        <p className="legalEffective">
          Effective date: <time dateTime={effectiveDate}>{effectiveDate}</time>
        </p>
      </header>

      <article className="legalBody">{children}</article>

      <footer className="legalFooter">
        <p>
          Questions? Contact{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or review our other
          policies:{" "}
          <Link href="/terms">Terms</Link>, <Link href="/privacy">Privacy</Link>,{" "}
          <Link href="/cookies">Cookies</Link>.
        </p>
      </footer>
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="legalSection">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
