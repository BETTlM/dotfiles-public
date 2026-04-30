export type ConfigCategory =
  | "shell"
  | "editor"
  | "terminal"
  | "ui"
  | "network"
  | "git"
  | "notes"
  | "other";

export interface ConfigEntry {
  id: string;
  title: string;
  description: string;
  category: ConfigCategory;
  sourcePath: string;
  storedPath: string;
  targetPath: string;
  tags: string[];
  checksum: string;
  updatedAt: string;
  /** Sanitized content size in bytes — used as a modification-depth signal. */
  size: number;
  /** Sanitized line count — used together with size to rank customization. */
  lines: number;
  /**
   * Optional sub-grouping label inside a category. Entries sharing a group are
   * rendered together under a sub-section header (e.g., per Obsidian vault,
   * per JetBrains IDE).
   */
  group?: string;
  /**
   * Importance score (0-100). Higher = more essential when bootstrapping a
   * new machine. Drives the "Essentials" section + within-category ordering.
   */
  priority?: number;
}

export interface ConfigManifest {
  version: string;
  generatedAt: string;
  entries: ConfigEntry[];
}
