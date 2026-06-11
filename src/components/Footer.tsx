import Link from "next/link";

import { copyrightYear, FOOTER_NAV, LEGAL_LINKS, SITE } from "@/lib/site";

export function Footer() {
  const year = copyrightYear();

  return (
    <footer className="footer">
      <div className="footerShell">
        <div className="footerGrid">
          <div className="footerCol footerColBrand">
            <Link href="/" className="footerBrand">
              <span className="brandMark">~/</span>
              {SITE.shortName}
            </Link>
            <p className="footerTagline">{SITE.tagline}</p>
            <p className="footerCopyright">
              &copy; {year} {SITE.owner}. All rights reserved.
            </p>
          </div>

          <div className="footerCol">
            <h2 className="footerHeading">Legal</h2>
            <ul className="footerLinks">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footerCol">
            <h2 className="footerHeading">Product</h2>
            <ul className="footerLinks">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  {"external" in link && link.external ? (
                    <Link href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </Link>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="footerCol">
            <h2 className="footerHeading">Compliance</h2>
            <ul className="footerLinks">
              <li>
                <Link href="/privacy#data-collection">Data collection</Link>
              </li>
              <li>
                <Link href="/privacy#your-rights">Your privacy rights</Link>
              </li>
              <li>
                <Link href="/cookies#manage">Manage cookies</Link>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`}>Report a security issue</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footerFinePrint">
          <p>
            {SITE.name} is operated by {SITE.ownerDisplay}. Config files are sanitized before
            publication; no warranty is provided. Third-party names and trademarks belong to their
            respective owners. Use of this site constitutes acceptance of our{" "}
            <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <p className="footerMeta">
            Last legal review: {SITE.lastLegalReview} &middot; Governing law: {SITE.jurisdiction}{" "}
            &middot;{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
