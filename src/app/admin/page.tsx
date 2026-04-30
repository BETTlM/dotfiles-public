import { getServerSession } from "next-auth";
import Link from "next/link";

import { AdminPanel } from "@/components/AdminPanel";
import { authOptions } from "@/lib/auth-options";
import { isAdminSession, ADMIN_GITHUB_LOGIN } from "@/lib/authz";
import { readManifest } from "@/lib/manifest";

function LockIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const hasGitHubOAuth =
    Boolean(process.env.GITHUB_CLIENT_ID) && Boolean(process.env.GITHUB_CLIENT_SECRET);
  if (!isAdminSession(session)) {
    return (
      <main className="container">
        <div className="authGate">
          <div className="authGateIcon">
            <LockIcon />
          </div>
          <h1>Admin access required</h1>
          <p>
            This zone is hard locked. Sign in with GitHub to manage configs. Only the account
            <code style={{ marginLeft: 4, marginRight: 4 }}>@{ADMIN_GITHUB_LOGIN}</code>
            is allowed in.
          </p>
          {hasGitHubOAuth ? (
            <Link
              href="/api/auth/signin/github"
              className="btn btnPrimary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <GithubIcon />
              Log in with GitHub
            </Link>
          ) : (
            <div className="lockChip" style={{ width: "100%", justifyContent: "center" }}>
              GitHub OAuth env vars missing on server
            </div>
          )}
          <div className="lockChip">
            <LockIcon />
            Allowlist locked: {ADMIN_GITHUB_LOGIN}
          </div>
        </div>
      </main>
    );
  }

  const manifest = await readManifest();
  return (
    <main className="container">
      <section className="hero" style={{ padding: "2.25rem 2rem" }}>
        <span className="heroBadge">
          <span className="dot" />
          Authenticated as @{session?.user?.name ?? ADMIN_GITHUB_LOGIN}
        </span>
        <h1 className="heroTitle" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          Admin <span className="gradient">war room</span>
        </h1>
        <p className="heroSubtitle">
          Add, update, or delete config entries. Inputs are sanitized and placeholder-normalized
          before commit, so the public vault stays clean and secrets stay hidden.
        </p>
      </section>

      <AdminPanel entries={manifest.entries} />
    </main>
  );
}
