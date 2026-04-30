import Link from "next/link";

import { Catalog } from "@/components/Catalog";
import { readManifest } from "@/lib/manifest";

export default async function Home() {
  const manifest = await readManifest();
  const totalFiles = manifest.entries.length;
  const totalCategories = new Set(manifest.entries.map((entry) => entry.category)).size;
  const totalTags = new Set(manifest.entries.flatMap((entry) => entry.tags)).size;

  const lastUpdated = manifest.entries
    .map((entry) => new Date(entry.updatedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const lastUpdatedLabel = lastUpdated
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(lastUpdated)
    : "N/A";

  return (
    <main className="container">
      <section className="hero">
        <span className="heroBadge">
          <span className="dot" />
          Live build, sanitized, aura maxed
        </span>
        <h1 className="heroTitle">
          My <span className="gradient">config stash</span> is lowkirkenuinely locked in and absolutely goated.
        </h1>
        <p className="heroSubtitle">
          Dotfiles, editor settings, and shell tweaks all live here. Grab one file or idk just download
          the whole bundle so your fresh machine does not spawn cringe and aura-negative. I don't know why you would do this, but you can if you want.
        </p>
        <div className="heroActions">
          <Link href="/download/bundle" className="btn btnPrimary">
            Download full bundle like a geeked stupid idiot
          </Link>
          <Link href="#catalog" className="btn btnSecondary">
            Open the stash like a locked in sigma
          </Link>
        </div>
        <div className="heroStats">
          <div className="statCell">
            <span className="statValue">{totalFiles}</span>
            <span className="statLabel">Configs</span>
          </div>
          <div className="statCell">
            <span className="statValue">{totalCategories}</span>
            <span className="statLabel">Categories</span>
          </div>
          <div className="statCell">
            <span className="statValue">{totalTags}</span>
            <span className="statLabel">Tags</span>
          </div>
          <div className="statCell">
            <span className="statValue">{lastUpdatedLabel}</span>
            <span className="statLabel">Last updated</span>
          </div>
        </div>
      </section>

      <div id="catalog">
        <Catalog entries={manifest.entries} />
      </div>
    </main>
  );
}
