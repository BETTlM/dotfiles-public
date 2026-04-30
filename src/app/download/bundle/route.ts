import { promises as fs } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

import tar from "tar-stream";

import { getConfigsDirectory, readManifest } from "@/lib/manifest";
import type { ConfigEntry } from "@/lib/types";

/**
 * Maps a stored config path into a friendlier bundle layout that mirrors what
 * the user expects on disk:
 *
 *   notes/obsidian/<vault-slug>/...     →  obsidian/<Vault Label>/...
 *   editor/<ide>/...                    →  ides/<IDE Label>/...
 *   <anything else>                     →  <unchanged>
 */
function bundlePathForEntry(entry: ConfigEntry): string {
  const stored = entry.storedPath;

  // Obsidian vaults — promote them out of `notes/obsidian/<slug>` into a
  // top-level `obsidian/<Vault Label>` so each vault is its own folder.
  const obsidianMatch = stored.match(/^notes\/obsidian\/[^/]+\/(.+)$/);
  if (obsidianMatch && entry.group?.startsWith("Obsidian")) {
    const vaultLabel = entry.group.replace(/^Obsidian\s*·\s*/, "").trim() || "Vault";
    return `obsidian/${vaultLabel}/${obsidianMatch[1]}`;
  }

  // IDE configs — group everything under `ides/<IDE>` regardless of subdir
  // (options, keymaps, colors, codestyles, snippets, skills, etc.).
  const editorMatch = stored.match(/^editor\/([^/]+)\/(.+)$/);
  if (editorMatch && entry.group) {
    return `ides/${entry.group}/${editorMatch[2]}`;
  }

  return stored;
}

function buildIndex(entries: ConfigEntry[], pathByEntryId: Map<string, string>): string {
  const lines: string[] = [];
  lines.push("# Personal config bundle");
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push(`# Files: ${entries.length}`);
  lines.push("");
  lines.push("Layout:");
  lines.push("  obsidian/<Vault>/...   — per-vault Obsidian settings");
  lines.push("  ides/<IDE>/...         — per-IDE editor configs");
  lines.push("  <category>/...         — everything else, by category");
  lines.push("");
  lines.push("Files (sorted by priority, then customization depth):");
  lines.push("");

  const sorted = [...entries].sort((a, b) => {
    const pa = a.priority ?? 0;
    const pb = b.priority ?? 0;
    if (pb !== pa) return pb - pa;
    const sa = (a.size ?? 0) + (a.lines ?? 0) * 12;
    const sb = (b.size ?? 0) + (b.lines ?? 0) * 12;
    return sb - sa;
  });

  for (const entry of sorted) {
    const bundlePath = pathByEntryId.get(entry.id) ?? entry.storedPath;
    const priorityTag = (entry.priority ?? 0) >= 70 ? "[ESSENTIAL] " : "";
    lines.push(`${priorityTag}${bundlePath}`);
    lines.push(`    target : ${entry.targetPath}`);
    if (entry.group) lines.push(`    group  : ${entry.group}`);
    lines.push("");
  }

  return lines.join("\n");
}

export async function GET() {
  try {
    const manifest = await readManifest();
    const pack = tar.pack();
    const baseDir = getConfigsDirectory();
    const includedEntries: ConfigEntry[] = [];

    const pathByEntryId = new Map<string, string>();
    for (const entry of manifest.entries) {
      pathByEntryId.set(entry.id, bundlePathForEntry(entry));
    }

    for (const entry of manifest.entries) {
      const absolute = path.join(baseDir, entry.storedPath);
      let content: Buffer;
      try {
        content = await fs.readFile(absolute);
      } catch (error) {
        // In restricted deployments, traced assets may omit some files.
        // Skip missing files instead of failing the entire bundle.
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          continue;
        }
        throw error;
      }
      const bundlePath = pathByEntryId.get(entry.id) ?? entry.storedPath;
      pack.entry({ name: bundlePath, mode: 0o644 }, content);
      includedEntries.push(entry);
    }

    // Bundle index for humans
    const indexBuffer = Buffer.from(buildIndex(includedEntries, pathByEntryId), "utf-8");
    pack.entry({ name: "MANIFEST.txt", mode: 0o644 }, indexBuffer);

    pack.finalize();

    const tarChunks: Buffer[] = [];
    for await (const chunk of pack) {
      tarChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const tarBuffer = Buffer.concat(tarChunks);
    const gzipBuffer = gzipSync(tarBuffer);

    return new Response(gzipBuffer, {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": 'attachment; filename="config-bundle.tar.gz"',
      },
    });
  } catch {
    return new Response("Bundle generation failed", { status: 500 });
  }
}
