import type { ConfigEntry, ConfigManifest } from "@/lib/types";
import { buildChecksum, readManifest, removeConfigFile, writeConfigFile, writeManifest } from "@/lib/manifest";
import { upsertRepoFile, deleteRepoFile } from "@/lib/github";
import { applyPlaceholders } from "@/lib/placeholders";
import { sanitizeConfig } from "@/lib/sanitize";

export interface UpsertConfigInput {
  id: string;
  title: string;
  description: string;
  category: ConfigEntry["category"];
  sourcePath: string;
  storedPath: string;
  targetPath: string;
  tags: string[];
  content: string;
}

function updateManifestEntry(manifest: ConfigManifest, entry: ConfigEntry) {
  const filtered = manifest.entries.filter((item) => item.id !== entry.id);
  return {
    ...manifest,
    generatedAt: new Date().toISOString(),
    entries: [...filtered, entry],
  };
}

export async function upsertConfig(input: UpsertConfigInput) {
  const sanitized = applyPlaceholders(sanitizeConfig(input.content), {
    username: process.env.CONFIG_USERNAME ?? "bettim",
    homeDir: process.env.CONFIG_HOME_DIR ?? "/Users/bettim",
  });
  const checksum = buildChecksum(sanitized);

  const entry: ConfigEntry = {
    id: input.id,
    title: input.title,
    description: input.description,
    category: input.category,
    sourcePath: input.sourcePath,
    storedPath: input.storedPath,
    targetPath: input.targetPath,
    tags: input.tags,
    checksum,
    updatedAt: new Date().toISOString(),
    size: Buffer.byteLength(sanitized, "utf-8"),
    lines: sanitized.length === 0 ? 0 : sanitized.split("\n").length,
  };

  const manifest = await readManifest();
  const updated = updateManifestEntry(manifest, entry);

  await writeConfigFile(input.storedPath, sanitized);
  await writeManifest(updated);

  return { entry, manifest: updated, content: sanitized };
}

export async function deleteConfig(id: string) {
  const manifest = await readManifest();
  const existing = manifest.entries.find((entry) => entry.id === id);
  if (!existing) {
    throw new Error(`Config '${id}' not found.`);
  }

  await removeConfigFile(existing.storedPath);
  const updated: ConfigManifest = {
    ...manifest,
    generatedAt: new Date().toISOString(),
    entries: manifest.entries.filter((entry) => entry.id !== id),
  };
  await writeManifest(updated);

  return { deleted: existing, manifest: updated };
}

function hasGitHubSyncConfig() {
  return Boolean(process.env.GITHUB_REPO_TOKEN && process.env.GITHUB_REPO_OWNER && process.env.GITHUB_REPO_NAME);
}

export async function syncUpsertToGitHub(entry: ConfigEntry, content: string, manifest: ConfigManifest) {
  if (!hasGitHubSyncConfig()) {
    return false;
  }

  await upsertRepoFile(`data/configs/${entry.storedPath}`, content, `chore(configs): update ${entry.id}`);
  await upsertRepoFile("data/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`, "chore(configs): update manifest");
  return true;
}

export async function syncDeleteToGitHub(storedPath: string, manifest: ConfigManifest, id: string) {
  if (!hasGitHubSyncConfig()) {
    return false;
  }

  await deleteRepoFile(`data/configs/${storedPath}`, `chore(configs): delete ${id}`);
  await upsertRepoFile("data/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`, "chore(configs): update manifest");
  return true;
}
