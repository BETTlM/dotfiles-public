import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/LegalDocument";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal Notice | Config Portal",
  description: "Copyright, trademark, and disclaimer notices for Config Portal.",
};

export default function LegalNoticePage() {
  return (
    <LegalDocument
      title="Legal Notice"
      subtitle="Copyright, trademarks, and important disclaimers."
      effectiveDate="2026-06-11"
    >
      <LegalSection id="operator" title="1. Operator">
        <p>
          {SITE.name} is operated by {SITE.owner} ({SITE.ownerDisplay}). For legal correspondence,
          contact <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </LegalSection>

      <LegalSection id="copyright" title="2. Copyright">
        <p>
          Unless otherwise noted, the site design, catalog metadata, and original written content on
          {SITE.name} are &copy; {new Date().getFullYear()} {SITE.owner}. All rights reserved.
          Configuration file contents may include third-party or open-source material subject to their
          respective licenses.
        </p>
      </LegalSection>

      <LegalSection id="trademarks" title="3. Trademarks">
        <p>
          Product names, logos, and brands referenced in configuration files or descriptions (including
          but not limited to JetBrains, Obsidian, GitHub, Apple, Microsoft, and Linux) are trademarks
          of their respective owners. {SITE.name} is not affiliated with, endorsed by, or sponsored by
          those entities unless explicitly stated.
        </p>
      </LegalSection>

      <LegalSection id="configs" title="4. Configuration files">
        <p>
          Files are exported from personal environments, sanitized to remove secrets, and normalized
          with placeholders such as {"{{HOME}}"} and {"{{USERNAME}}"}. Sanitization is best-effort;
          you are responsible for reviewing files before use. Do not rely on published configs for
          production security boundaries without independent review.
        </p>
      </LegalSection>

      <LegalSection id="external" title="5. External links">
        <p>
          Links to third-party sites (including GitHub) are provided for convenience. We are not
          responsible for their content, privacy practices, or availability.
        </p>
      </LegalSection>

      <LegalSection id="dmca" title="6. Copyright complaints">
        <p>
          If you believe content on this Service infringes your copyright, send a notice to{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> including: identification
          of the work, the URL of the material, your contact information, and a statement of good
          faith belief. Counter-notices may be submitted under applicable law.
        </p>
      </LegalSection>

      <LegalSection id="no-advice" title="7. No professional advice">
        <p>
          Information on this Service is for general configuration reference only and does not
          constitute legal, security, or professional IT advice.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
