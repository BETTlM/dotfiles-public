import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/LegalDocument";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility Statement | Config Portal",
  description: "Accessibility commitment and support channels for Config Portal.",
};

export default function AccessibilityPage() {
  return (
    <LegalDocument
      title="Accessibility Statement"
      subtitle="Our commitment to usable, perceivable experiences for all visitors."
      effectiveDate="2026-06-11"
    >
      <LegalSection id="commitment" title="1. Commitment">
        <p>
          {SITE.owner} aims to make {SITE.name} accessible to people with disabilities. We work toward
          conformance with WCAG 2.1 Level AA where practical for a developer-focused catalog and
          viewer experience.
        </p>
      </LegalSection>

      <LegalSection id="measures" title="2. Measures we take">
        <ul>
          <li>Semantic HTML landmarks (header, main, footer, nav).</li>
          <li>Keyboard-focusable controls and visible focus states on interactive elements.</li>
          <li>Text alternatives for non-decorative icons where applicable.</li>
          <li>Sufficient color contrast on primary text and controls in the default theme.</li>
          <li>Respect for prefers-reduced-motion for animations.</li>
          <li>Responsive layout for mobile and zoomed views.</li>
        </ul>
      </LegalSection>

      <LegalSection id="known" title="3. Known limitations">
        <p>
          Syntax-highlighted code blocks may not expose full structure to all assistive technologies.
          Some third-party embedded content (e.g. OAuth flows) is controlled by external providers.
          We continue to improve catalog filtering and config viewer navigation.
        </p>
      </LegalSection>

      <LegalSection id="feedback" title="4. Feedback and assistance">
        <p>
          If you encounter an accessibility barrier, contact{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the page
          URL and a description of the issue. We will try to respond within five business days.
        </p>
      </LegalSection>

      <LegalSection id="enforcement" title="5. Enforcement procedures">
        <p>
          Users in jurisdictions with accessibility regulations may have additional rights to file
          complaints with relevant authorities. We welcome direct contact first so we can address
          issues promptly.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
