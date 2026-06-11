import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/LegalDocument";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy | Config Portal",
  description: "Cookies and similar technologies used on Config Portal.",
};

export default function CookiesPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      subtitle="How we use cookies and similar storage on this site."
      effectiveDate="2026-06-11"
    >
      <LegalSection id="what" title="1. What are cookies?">
        <p>
          Cookies are small text files stored on your device. Similar technologies include local
          storage and session storage. We use them to keep the Service secure, remember preferences,
          and understand aggregate usage.
        </p>
      </LegalSection>

      <LegalSection id="types" title="2. Cookies we use">
        <div className="legalTableWrap">
          <table className="legalTable">
            <thead>
              <tr>
                <th>Category</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Strictly necessary</td>
                <td>Admin session and CSRF protection via NextAuth (admin sign-in only)</td>
                <td>Session / auth provider default</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>Anonymous traffic measurement via Vercel Analytics</td>
                <td>Per provider policy</td>
              </tr>
              <tr>
                <td>Functional</td>
                <td>Remember UI state in your browser (if enabled by features)</td>
                <td>Until cleared</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="third-party" title="3. Third-party cookies">
        <p>
          GitHub may set cookies when you authenticate as an administrator. Vercel may set analytics
          cookies when Analytics is enabled. We do not use advertising or social tracking pixels on
          the public catalog.
        </p>
      </LegalSection>

      <LegalSection id="manage" title="4. Managing cookies">
        <p>
          You can block or delete cookies through your browser settings. Blocking strictly necessary
          cookies may prevent admin sign-in from working. Where required by law, we will request
          consent before placing non-essential analytics cookies.
        </p>
        <p>
          Browser controls: Chrome Settings &gt; Privacy and security &gt; Cookies; Safari Settings
          &gt; Privacy; Firefox Settings &gt; Privacy &amp; Security.
        </p>
      </LegalSection>

      <LegalSection id="updates" title="5. Updates">
        <p>
          We may update this Cookie Policy when our tooling changes. Check the effective date at the
          top of this page.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="6. Contact">
        <p>
          Cookie questions:{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
