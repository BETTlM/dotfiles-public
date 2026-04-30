import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import type { ConfigEntry, ConfigManifest } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIGS_DIR = path.join(DATA_DIR, "configs");
const MANIFEST_PATH = path.join(DATA_DIR, "manifest.json");

export function getManifestPath() {
  return MANIFEST_PATH;
}

export function getConfigsDirectory() {
  return CONFIGS_DIR;
}

export function buildChecksum(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function sortEntries(entries: ConfigEntry[]) {
  return [...entries].sort((a, b) => a.title.localeCompare(b.title));
}

export async function readManifest(): Promise<ConfigManifest> {
  const raw = await fs.readFile(MANIFEST_PATH, "utf-8");
  const parsed = JSON.parse(raw) as ConfigManifest;
  return {
    ...parsed,
    entries: sortEntries(parsed.entries),
  };
}

export async function writeManifest(manifest: ConfigManifest) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const normalized: ConfigManifest = {
    ...manifest,
    entries: sortEntries(manifest.entries),
  };
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(normalized, null, 2)}\n`, "utf-8");
}

export async function readConfigFile(storedPath: string) {
  const absolute = path.join(CONFIGS_DIR, storedPath);
  return fs.readFile(absolute, "utf-8");
}

export async function writeConfigFile(storedPath: string, content: string) {
  const absolute = path.join(CONFIGS_DIR, storedPath);
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, content, "utf-8");
}

export async function removeConfigFile(storedPath: string) {
  const absolute = path.join(CONFIGS_DIR, storedPath);
  await fs.rm(absolute, { force: true });
}
