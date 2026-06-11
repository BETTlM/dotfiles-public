import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/LegalDocument";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Config Portal",
  description: "How Config Portal collects, uses, and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      subtitle="How we handle information when you browse, download, or sign in."
      effectiveDate="2026-06-11"
    >
      <LegalSection id="overview" title="1. Overview">
        <p>
          {SITE.owner} (&ldquo;we,&rdquo; &ldquo;us&rdquo;) operates {SITE.name}. This Privacy Policy
          explains what information we process, why we process it, and the choices available to you.
          This policy applies to visitors, downloaders, and authenticated administrators.
        </p>
      </LegalSection>

      <LegalSection id="data-collection" title="2. Information we collect">
        <p>Depending on how you use the Service, we may process:</p>
        <ul>
          <li>
            <strong>Usage and analytics data</strong> — page views, referrers, device/browser type,
            and approximate geography via Vercel Analytics when enabled.
          </li>
          <li>
            <strong>Authentication data (admin only)</strong> — GitHub profile identifiers, username,
            and session tokens when you sign in through GitHub OAuth.
          </li>
          <li>
            <strong>Server logs</strong> — IP address, request timestamps, user agent, and error
            diagnostics retained by our hosting provider for security and reliability.
          </li>
          <li>
            <strong>Communications</strong> — information you send by email (e.g. security or
            accessibility reports).
          </li>
        </ul>
        <p>
          Public visitors who only browse or download files are not required to create an account. We
          do not knowingly collect sensitive personal data through the public catalog.
        </p>
      </LegalSection>

      <LegalSection id="use" title="3. How we use information">
        <p>We use collected information to:</p>
        <ul>
          <li>Operate, secure, and improve the Service.</li>
          <li>Authenticate authorized administrators.</li>
          <li>Measure aggregate traffic and performance.</li>
          <li>Respond to legal requests, abuse reports, and support inquiries.</li>
          <li>Detect fraud, unauthorized access, and technical incidents.</li>
        </ul>
      </LegalSection>

      <LegalSection id="legal-bases" title="4. Legal bases (EEA/UK)">
        <p>
          Where GDPR or UK GDPR applies, we rely on: (a) legitimate interests in operating and
          securing a public utility site; (b) contract performance for admin authentication; (c)
          consent where required for non-essential cookies; and (d) legal obligation where applicable.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="5. Sharing and processors">
        <p>We may share information with service providers that help us run the Service, including:</p>
        <ul>
          <li>Hosting and deployment (e.g. Vercel)</li>
          <li>Analytics (Vercel Analytics)</li>
          <li>Authentication (GitHub, via NextAuth)</li>
        </ul>
        <p>
          We do not sell personal information. We do not share data for cross-context behavioral
          advertising. We may disclose information if required by law or to protect rights and safety.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="6. Retention">
        <p>
          Analytics and server logs are retained only as long as needed for the purposes above or as
          required by our providers&apos; policies. Admin session data persists for the duration of
          your session and associated auth provider retention windows.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" title="7. Your rights">
        <p>
          Depending on your location, you may have rights to access, correct, delete, restrict, or
          port personal data, and to object to certain processing. California residents may have
          additional rights under the CCPA/CPRA, including the right to know and delete personal
          information we collect. We do not sell personal information.
        </p>
        <p>
          To exercise rights, email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We may verify your request
          before responding.
        </p>
      </LegalSection>

      <LegalSection id="international" title="8. International transfers">
        <p>
          Data may be processed in countries where our hosting and analytics providers operate. Where
          required, we rely on appropriate safeguards such as standard contractual clauses or
          provider certifications.
        </p>
      </LegalSection>

      <LegalSection id="children" title="9. Children">
        <p>
          The Service is not directed to children under 13 (or 16 where applicable). We do not
          knowingly collect personal information from children.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="10. Changes">
        <p>
          We may update this Privacy Policy. Material changes will be reflected by updating the
          effective date above. Continued use after changes constitutes notice of the updated policy.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="11. Contact">
        <p>
          Privacy inquiries:{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
