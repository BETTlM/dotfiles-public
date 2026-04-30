import Link from "next/link";
import { notFound } from "next/navigation";

import { CodeViewer } from "@/components/CodeViewer";
import { inferLanguage } from "@/lib/language";
import { readConfigFile, readManifest } from "@/lib/manifest";

interface ConfigPageProps {
  params: Promise<{ id: string }>;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default async function ConfigPage({ params }: ConfigPageProps) {
  const { id } = await params;
  const manifest = await readManifest();
  const entry = manifest.entries.find((item) => item.id === id);
  if (!entry) {
    notFound();
  }

  const content = await readConfigFile(entry.storedPath);
  const language = inferLanguage(entry.storedPath, content);
  const filename = entry.storedPath.split("/").pop() ?? entry.storedPath;
  const lineCount = content.split("\n").length;
  const sizeLabel = formatBytes(Buffer.byteLength(content, "utf-8"));
  const updatedLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(entry.updatedAt));

  return (
    <main className="container">
      <div className="breadcrumbs">
        <Link href="/">Stash</Link>
        <span className="sep">/</span>
        <Link href={`/?category=${entry.category}`}>{entry.category}</Link>
        <span className="sep">/</span>
        <span className="current">{entry.title}</span>
      </div>

      <div className="viewLayout">
        <div className="viewMain">
          <header className="viewHeader">
            <h1 className="viewTitle">{entry.title}</h1>
            <p className="viewDesc">{entry.description}</p>
            <div className="viewActions">
              <Link href={`/download/${entry.id}`} className="btn btnPrimary">
                Yoink file
              </Link>
              <Link href="/download/bundle" className="btn btnSecondary">
                Yoink full bundle
              </Link>
              <Link href="/" className="btn btnGhost">
                Back to stash
              </Link>
            </div>
          </header>
          <CodeViewer code={content} language={language} filename={filename} />
        </div>

        <aside className="metaPanel">
          <h3 className="metaPanelTitle">File intel</h3>
          <div className="metaList">
            <div className="metaItem">
              <span className="metaKey">Category</span>
              <span className="metaValue">{entry.category}</span>
            </div>
            <div className="metaItem">
              <span className="metaKey">Source path</span>
              <span className="metaValue">{entry.sourcePath}</span>
            </div>
            <div className="metaItem">
              <span className="metaKey">Install path</span>
              <span className="metaValue">{entry.targetPath}</span>
            </div>
            <div className="metaItem">
              <span className="metaKey">Stored path</span>
              <span className="metaValue">{entry.storedPath}</span>
            </div>
            <div className="metaItem">
              <span className="metaKey">Size</span>
              <span className="metaValue">
                {sizeLabel} · {lineCount} lines
              </span>
            </div>
            <div className="metaItem">
              <span className="metaKey">Last updated</span>
              <span className="metaValue">{updatedLabel}</span>
            </div>
            <div className="metaItem">
              <span className="metaKey">Checksum</span>
              <span className="metaValue" title={entry.checksum}>
                {entry.checksum.slice(0, 16)}…
              </span>
            </div>
            {entry.tags.length > 0 ? (
              <div className="metaItem">
                <span className="metaKey">Tags</span>
                <div className="metaTagRow">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
