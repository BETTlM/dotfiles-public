import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/LegalDocument";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service | Config Portal",
  description: "Terms governing use of the Config Portal and downloaded configuration files.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      subtitle={`Rules for accessing ${SITE.name} and using published configuration files.`}
      effectiveDate="2026-06-11"
    >
      <LegalSection id="acceptance" title="1. Acceptance">
        <p>
          By accessing or using {SITE.name} (the &ldquo;Service&rdquo;), you agree to these Terms of
          Service (&ldquo;Terms&rdquo;). If you do not agree, do not use the Service. We may update
          these Terms from time to time; continued use after changes constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection id="service" title="2. Description of service">
        <p>
          The Service provides read-only access to sanitized configuration files, metadata, and
          downloadable bundles for personal setup purposes. Administrative features are restricted to
          authorized operators. The Service is provided free of charge unless otherwise stated.
        </p>
      </LegalSection>

      <LegalSection id="license" title="3. License to configuration files">
        <p>
          Unless a file or bundle states otherwise, configuration files are made available for
          personal, non-commercial use. You may copy, modify, and deploy them on your own systems.
          You may not resell, sublicense, or misrepresent authorship of the files as an official
          product of any third-party vendor named in the content.
        </p>
      </LegalSection>

      <LegalSection id="prohibited" title="4. Prohibited conduct">
        <p>You agree not to:</p>
        <ul>
          <li>Attempt to gain unauthorized access to admin areas, APIs, or infrastructure.</li>
          <li>Scrape or bulk-harvest the Service in a way that degrades availability for others.</li>
          <li>Upload malicious content through any authorized admin channel.</li>
          <li>Use downloaded files to violate applicable law or third-party license terms.</li>
          <li>Remove or obscure sanitization placeholders, attribution, or legal notices.</li>
        </ul>
      </LegalSection>

      <LegalSection id="disclaimer" title="5. Disclaimer of warranties">
        <p>
          THE SERVICE AND ALL CONFIGURATION FILES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
          INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do
          not warrant that files are complete, current, error-free, or free of sensitive data despite
          sanitization efforts.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="6. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE.owner} AND ITS OPERATORS SHALL NOT BE LIABLE
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
          DATA, PROFITS, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE OR ANY DOWNLOADED FILES.
          OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS (USD $100).
        </p>
      </LegalSection>

      <LegalSection id="indemnity" title="7. Indemnification">
        <p>
          You agree to indemnify and hold harmless {SITE.owner} from claims arising out of your
          misuse of the Service, violation of these Terms, or infringement of third-party rights
          through your use of downloaded materials.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="8. Termination">
        <p>
          We may suspend or terminate access to the Service at any time, with or without notice, for
          conduct that violates these Terms or poses a security risk. Provisions that by nature should
          survive termination (disclaimers, limitations, indemnity) will survive.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="9. Governing law">
        <p>
          These Terms are governed by the laws of {SITE.jurisdiction}, without regard to conflict-of-law
          principles. Exclusive jurisdiction for disputes lies in the courts of {SITE.jurisdiction},
          unless mandatory consumer protection law in your country requires otherwise.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <p>
          For questions about these Terms, contact{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
