/** Shared site metadata for layout, footer, and legal pages. */
export const SITE = {
  name: "Config Portal",
  shortName: "configs",
  tagline: "Sanitized dotfiles and setup files for public download.",
  owner: "BETTlM",
  ownerDisplay: "@BETTlM",
  githubUrl: "https://github.com/BETTlM",
  canonicalUrl: "https://dotfiles.bettim.tech",
  email: "sanjith@bettim.tech",
  jurisdiction: "India",
  lastLegalReview: "June 11, 2026",
} as const;

export function copyrightYear(): number {
  return new Date().getFullYear();
}

export const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/legal", label: "Legal Notice" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

export const FOOTER_NAV = [
  { href: "/#catalog", label: "Catalog" },
  { href: "/download/bundle", label: "Download bundle" },
  { href: "/admin", label: "Admin" },
  { href: SITE.githubUrl, label: "GitHub", external: true },
] as const;
