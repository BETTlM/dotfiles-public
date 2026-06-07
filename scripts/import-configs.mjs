#!/usr/bin/env node
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

const workspaceRoot = process.cwd();
const dataDir = path.join(workspaceRoot, "data");
const outConfigDir = path.join(dataDir, "configs");
const manifestPath = path.join(dataDir, "manifest.json");
const home = os.homedir();
const username = process.env.CONFIG_USERNAME ?? path.basename(home);

const MAX_FILE_SIZE_BYTES = 512 * 1024;

const TEXT_EXTENSIONS = new Set([
  ".conf",
  ".lua",
  ".json",
  ".jsonc",
  ".sh",
  ".zsh",
  ".bash",
  ".fish",
  ".xml",
  ".txt",
  ".md",
  ".toml",
  ".yaml",
  ".yml",
  ".ini",
  ".gitconfig",
  ".config",
  ".css",
  ".code-snippets",
  ".icls",
  ".properties",
  ".tmTheme",
  ".plist",
  ".vmoptions",
  ".scss",
  ".keymap",
  ".tmLanguage",
]);

const TEXT_BASENAMES = new Set([
  "config",
  ".zshrc",
  ".zprofile",
  ".gitconfig",
  "sketchybarrc",
  "Brewfile",
  "Dockerfile",
  "Procfile",
  "Makefile",
  "bundled_plugins.txt",
  "disabled_plugins.txt",
  "early-access-registry.txt",
]);

const GLOBAL_DENY_BASENAMES = new Set([
  ".DS_Store",
  "lockfile",
  "ipc_secret_key.txt",
  "log.txt",
  "log-cross-app-ipc.txt",
  "id",
  "Cookies",
  "Cookies-journal",
  "obsidian.log",
  "Custom Dictionary.txt",
  "Custom Dictionary.txt.backup",
  "TransportSecurity",
  "Network Persistent State",
  "Trust Tokens",
  "Trust Tokens-journal",
  "SharedStorage",
  "Preferences",
  "machine_id_v4",
  "credentials.toml",
  "oauth_creds.json",
  "google_accounts.json",
  "installation_id",
  ".token_seed",
  ".token_seed.lock",
  "idea.key",
  "clion.key",
  "datagrip.key",
  "plugin_PCWMP.license",
  "settingsSync.xml",
  "settingsSyncLocal.xml",
  "trusted-paths.xml",
  "recentProjects.xml",
  "tasks.xml",
  "window.state.xml",
  "window.layouts.xml",
  "actionSummary.xml",
  "contributorSummary.xml",
  "features.usage.statistics.xml",
  "AIAssistantQuotaManager2.xml",
  "AINaturalLanguagePromotionState.xml",
  "AIOnboardingPromoWindowAdvisor.xml",
  "CommonFeedbackSurveyService.xml",
  "DontShowAgainFeedbackService.xml",
  "InstallJunieHubActionManager.xml",
  "MatterhornModelPersistentStateComponent.xml",
  "ide-features-trainer.xml",
  "kotlin-onboarding.xml",
  "k2-feedback.xml",
  "pycharm-job-survey-service.xml",
  "early-access-registry.txt",
  "updatedBrokenPlugins.db",
  "app-internal-state.db",
]);

const GLOBAL_DENY_SEGMENTS = new Set([
  "node_modules",
  "Cache",
  "Caches",
  "Code Cache",
  "GPUCache",
  "DawnGraphiteCache",
  "DawnWebGPUCache",
  "Service Worker",
  "Local Storage",
  "Session Storage",
  "IndexedDB",
  "WebStorage",
  "blob_storage",
  "Shared Dictionary",
  "History",
  "workspaceStorage",
  "globalStorage",
  "tmp",
  "temp",
  "log",
  "logs",
  "extensions",
  "_logs",
  "_cacache",
  "_npx",
  "JoplinBackup",
  "resources",
  "event-log-metadata",
  "ssl",
  "consoles",
  "tasks",
  "workspace",
  "jdbc-drivers",
  "settingsSync",
  "migration",
  "light-edit",
]);

/**
 * Each tuple: [sourcePath, storedPath, targetPath, category, title, description, tags, group?]
 */
const FILES = [
  // Shell
  ["~/.zshrc", "shell/zshrc", "~/.zshrc", "shell", "Zsh RC", "Primary interactive shell configuration.", ["zsh", "shell"], "Zsh"],
  ["~/.zprofile", "shell/zprofile", "~/.zprofile", "shell", "Zsh Profile", "Login shell setup values.", ["zsh", "shell"], "Zsh"],
  ["~/.p10k.zsh", "shell/p10k.zsh", "~/.p10k.zsh", "shell", "Powerlevel10k Theme", "Prompt theme and segments.", ["zsh", "theme"], "Zsh"],

  // Git
  ["~/.gitconfig", "git/gitconfig", "~/.gitconfig", "git", "Git Config", "Global git configuration.", ["git"], "Git"],
  ["~/.config/jgit/config", "git/jgit-config", "~/.config/jgit/config", "git", "JGit Config", "JGit filesystem timestamp configuration.", ["git", "jgit"], "JGit"],

  // Network
  ["~/.ssh/config", "network/ssh-config", "~/.ssh/config", "network", "SSH Config", "SSH host aliases and defaults.", ["ssh", "network"], "SSH"],
  ["~/.config/filezilla/filezilla.xml", "network/filezilla.xml", "~/.config/filezilla/filezilla.xml", "network", "FileZilla Settings", "FileZilla app settings.", ["filezilla", "ftp"], "FileZilla"],
  ["~/.config/filezilla/recentservers.xml", "network/filezilla-recentservers.xml", "~/.config/filezilla/recentservers.xml", "network", "FileZilla Recent Servers", "Recent FileZilla server entries.", ["filezilla", "ftp"], "FileZilla"],

  // Terminal
  ["~/.config/btop/btop.conf", "terminal/btop.conf", "~/.config/btop/btop.conf", "terminal", "btop", "btop system monitor preferences.", ["terminal", "monitoring"], "btop"],
  ["~/.config/fastfetch/config.jsonc", "terminal/fastfetch-config.jsonc", "~/.config/fastfetch/config.jsonc", "terminal", "Fastfetch", "Fastfetch display profile.", ["terminal", "fetch"], "Fastfetch"],
  ["~/.config/neofetch/config.conf", "terminal/neofetch.conf", "~/.config/neofetch/config.conf", "terminal", "Neofetch", "Neofetch text output configuration.", ["terminal", "fetch"], "Neofetch"],
  ["~/Library/Application Support/com.mitchellh.ghostty/config", "terminal/ghostty-config", "~/Library/Application Support/com.mitchellh.ghostty/config", "terminal", "Ghostty", "Ghostty terminal emulator configuration.", ["terminal", "ghostty"], "Ghostty"],

  // Editors — Zed
  ["~/.config/zed/settings.json", "editor/zed/settings.json", "~/.config/zed/settings.json", "editor", "Zed Settings", "Zed editor settings profile.", ["editor", "zed"], "Zed"],

  // Editors — VSCode
  ["~/Library/Application Support/Code/User/settings.json", "editor/vscode/settings.json", "~/Library/Application Support/Code/User/settings.json", "editor", "VSCode Settings", "Visual Studio Code user settings.", ["editor", "vscode"], "VSCode"],
  ["~/Library/Application Support/Code/User/keybindings.json", "editor/vscode/keybindings.json", "~/Library/Application Support/Code/User/keybindings.json", "editor", "VSCode Keybindings", "Visual Studio Code custom keybindings.", ["editor", "vscode", "keybindings"], "VSCode"],
  ["~/.vscode/argv.json", "editor/vscode/argv.json", "~/.vscode/argv.json", "editor", "VSCode argv", "VSCode runtime argument overrides.", ["editor", "vscode"], "VSCode"],

  // Editors — Cursor
  ["~/Library/Application Support/Cursor/User/settings.json", "editor/cursor/settings.json", "~/Library/Application Support/Cursor/User/settings.json", "editor", "Cursor Settings", "Cursor editor user settings.", ["editor", "cursor"], "Cursor"],
  ["~/Library/Application Support/Cursor/User/keybindings.json", "editor/cursor/keybindings.json", "~/Library/Application Support/Cursor/User/keybindings.json", "editor", "Cursor Keybindings", "Cursor custom keybindings.", ["editor", "cursor", "keybindings"], "Cursor"],
  ["~/.cursor/argv.json", "editor/cursor/argv.json", "~/.cursor/argv.json", "editor", "Cursor argv", "Cursor runtime argument overrides.", ["editor", "cursor"], "Cursor"],

  // Dev
  ["~/.config/github-copilot/apps.json", "dev/github-copilot-apps.json", "~/.config/github-copilot/apps.json", "other", "GitHub Copilot Apps", "Copilot apps configuration.", ["copilot", "ai"], "GitHub Copilot"],
  ["~/.config/github-copilot/versions.json", "dev/github-copilot-versions.json", "~/.config/github-copilot/versions.json", "other", "GitHub Copilot Versions", "Copilot client versions.", ["copilot", "ai"], "GitHub Copilot"],

  // Notes
  ["~/.config/joplin-desktop/settings.json", "notes/joplin-settings.json", "~/.config/joplin-desktop/settings.json", "notes", "Joplin Settings", "Joplin desktop application settings.", ["joplin", "notes"], "Joplin"],

  // AI tooling
  ["~/.gemini/settings.json", "ai/gemini-settings.json", "~/.gemini/settings.json", "other", "Gemini CLI Settings", "Google Gemini CLI settings.", ["gemini", "ai"], "Gemini CLI"],
  ["~/.gemini/state.json", "ai/gemini-state.json", "~/.gemini/state.json", "other", "Gemini CLI State", "Google Gemini CLI state.", ["gemini", "ai"], "Gemini CLI"],

  // Containers
  ["~/.docker/config.json", "containers/docker-config.json", "~/.docker/config.json", "other", "Docker Config", "Docker CLI configuration.", ["docker", "containers"], "Docker"],
  ["~/.docker/daemon.json", "containers/docker-daemon.json", "~/.docker/daemon.json", "other", "Docker Daemon", "Docker daemon configuration.", ["docker", "containers"], "Docker"],
];

const DIRECTORIES = [
  // Editors / IDEs
  {
    sourcePath: "~/.config/nvim",
    storePrefix: "editor/nvim",
    targetPrefix: "~/.config/nvim",
    category: "editor",
    tags: ["nvim", "editor"],
    group: "Neovim",
  },
  {
    sourcePath: "~/Library/Application Support/Code/User/snippets",
    storePrefix: "editor/vscode/snippets",
    targetPrefix: "~/Library/Application Support/Code/User/snippets",
    category: "editor",
    tags: ["editor", "vscode", "snippets"],
    group: "VSCode",
  },
  {
    sourcePath: "~/Library/Application Support/Cursor/User/snippets",
    storePrefix: "editor/cursor/snippets",
    targetPrefix: "~/Library/Application Support/Cursor/User/snippets",
    category: "editor",
    tags: ["editor", "cursor", "snippets"],
    group: "Cursor",
  },

  // JetBrains: only safe subdirs
  {
    sourcePath: "~/Library/Application Support/JetBrains/IntelliJIdea2025.1/options",
    storePrefix: "editor/intellij/options",
    targetPrefix: "~/Library/Application Support/JetBrains/IntelliJIdea2025.1/options",
    category: "editor",
    tags: ["intellij", "jetbrains", "editor"],
    group: "IntelliJ IDEA",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/IntelliJIdea2025.1/keymaps",
    storePrefix: "editor/intellij/keymaps",
    targetPrefix: "~/Library/Application Support/JetBrains/IntelliJIdea2025.1/keymaps",
    category: "editor",
    tags: ["intellij", "jetbrains", "keymaps"],
    group: "IntelliJ IDEA",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/IntelliJIdea2025.1/colors",
    storePrefix: "editor/intellij/colors",
    targetPrefix: "~/Library/Application Support/JetBrains/IntelliJIdea2025.1/colors",
    category: "editor",
    tags: ["intellij", "jetbrains", "colors"],
    group: "IntelliJ IDEA",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/IntelliJIdea2025.1/codestyles",
    storePrefix: "editor/intellij/codestyles",
    targetPrefix: "~/Library/Application Support/JetBrains/IntelliJIdea2025.1/codestyles",
    category: "editor",
    tags: ["intellij", "jetbrains", "codestyles"],
    group: "IntelliJ IDEA",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/CLion2025.1/options",
    storePrefix: "editor/clion/options",
    targetPrefix: "~/Library/Application Support/JetBrains/CLion2025.1/options",
    category: "editor",
    tags: ["clion", "jetbrains", "editor"],
    group: "CLion",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/CLion2025.1/keymaps",
    storePrefix: "editor/clion/keymaps",
    targetPrefix: "~/Library/Application Support/JetBrains/CLion2025.1/keymaps",
    category: "editor",
    tags: ["clion", "jetbrains", "keymaps"],
    group: "CLion",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/CLion2025.1/colors",
    storePrefix: "editor/clion/colors",
    targetPrefix: "~/Library/Application Support/JetBrains/CLion2025.1/colors",
    category: "editor",
    tags: ["clion", "jetbrains", "colors"],
    group: "CLion",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/CLion2025.1/codestyles",
    storePrefix: "editor/clion/codestyles",
    targetPrefix: "~/Library/Application Support/JetBrains/CLion2025.1/codestyles",
    category: "editor",
    tags: ["clion", "jetbrains", "codestyles"],
    group: "CLion",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/DataGrip2025.1/options",
    storePrefix: "editor/datagrip/options",
    targetPrefix: "~/Library/Application Support/JetBrains/DataGrip2025.1/options",
    category: "editor",
    tags: ["datagrip", "jetbrains", "editor"],
    group: "DataGrip",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/DataGrip2025.1/keymaps",
    storePrefix: "editor/datagrip/keymaps",
    targetPrefix: "~/Library/Application Support/JetBrains/DataGrip2025.1/keymaps",
    category: "editor",
    tags: ["datagrip", "jetbrains", "keymaps"],
    group: "DataGrip",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/DataGrip2025.1/colors",
    storePrefix: "editor/datagrip/colors",
    targetPrefix: "~/Library/Application Support/JetBrains/DataGrip2025.1/colors",
    category: "editor",
    tags: ["datagrip", "jetbrains", "colors"],
    group: "DataGrip",
  },
  {
    sourcePath: "~/Library/Application Support/JetBrains/DataGrip2025.1/codestyles",
    storePrefix: "editor/datagrip/codestyles",
    targetPrefix: "~/Library/Application Support/JetBrains/DataGrip2025.1/codestyles",
    category: "editor",
    tags: ["datagrip", "jetbrains", "codestyles"],
    group: "DataGrip",
  },

  // UI / system bar
  {
    sourcePath: "~/.config/sketchybar",
    storePrefix: "ui/sketchybar",
    targetPrefix: "~/.config/sketchybar",
    category: "ui",
    tags: ["ui", "sketchybar"],
    group: "Sketchybar",
  },
  {
    sourcePath: "~/.config/raycast/extensions",
    storePrefix: "ui/raycast/extensions",
    targetPrefix: "~/.config/raycast/extensions",
    category: "ui",
    tags: ["raycast", "ui"],
    allowBasenames: ["package.json"],
    skipSegments: ["node_modules"],
    group: "Raycast",
  },

  // Cursor skills + plans (local config knowledge)
  {
    sourcePath: "~/.cursor/skills-cursor",
    storePrefix: "editor/cursor/skills",
    targetPrefix: "~/.cursor/skills-cursor",
    category: "editor",
    tags: ["cursor", "skills"],
    group: "Cursor",
  },
];

const OBSIDIAN_VAULTS = [
  {
    label: "Journal",
    sourcePath: "~/Documents/Obsidian/Journal/.obsidian",
    storePrefix: "notes/obsidian/journal",
    targetPrefix: "~/Documents/Obsidian/Journal/.obsidian",
  },
  {
    label: "Semester 3",
    sourcePath: "~/Documents/Semester 3/Obsidian/.obsidian",
    storePrefix: "notes/obsidian/semester-3",
    targetPrefix: "~/Documents/Semester 3/Obsidian/.obsidian",
  },
  {
    label: "Semester 4",
    sourcePath: "~/Documents/Semester 4/Obsidian/.obsidian",
    storePrefix: "notes/obsidian/semester-4",
    targetPrefix: "~/Documents/Semester 4/Obsidian/.obsidian",
  },
  {
    label: "Summer 2026",
    sourcePath: "~/Documents/Summer 2026/Obsidian/.obsidian",
    storePrefix: "notes/obsidian/summer-2026",
    targetPrefix: "~/Documents/Summer 2026/Obsidian/.obsidian",
  },
];

const OBSIDIAN_ALLOW_BASENAMES = new Set([
  "app.json",
  "appearance.json",
  "bookmarks.json",
  "community-plugins.json",
  "core-plugins.json",
  "core-plugins-migration.json",
  "graph.json",
  "hotkeys.json",
  "templates.json",
  "daily-notes.json",
  "page-preview.json",
  "switcher.json",
  "workspace.json",
  "workspace-mobile.json",
  "manifest.json",
  "data.json",
]);

function resolveHome(p) {
  if (p.startsWith("~/")) {
    return path.join(home, p.slice(2));
  }
  return p;
}

function checksum(content) {
  return createHash("sha256").update(content).digest("hex");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PLACEHOLDER_REPLACEMENTS = [
  { regex: new RegExp(escapeRegex(home), "g"), token: "{{HOME}}" },
  { regex: new RegExp(`/Users/${escapeRegex(username)}`, "g"), token: "{{HOME}}" },
  { regex: new RegExp(`/home/${escapeRegex(username)}`, "g"), token: "{{HOME}}" },
  { regex: new RegExp(`\\b${escapeRegex(username)}\\b`, "g"), token: "{{USERNAME}}" },
];

function withPlaceholders(input) {
  let output = input;
  for (const { regex, token } of PLACEHOLDER_REPLACEMENTS) {
    output = output.replace(regex, token);
  }
  return output;
}

function sanitize(input) {
  let output = input;
  output = output.replace(/\b(ghp|gho|ghu|ghs|ghr|github_pat|glpat|sk|xoxb|xoxp|xoxa|xoxs|xoxr|AIza)[A-Za-z0-9_\-]{10,}\b/g, "[REDACTED]");
  output = output.replace(/((?:token|oauth[_-]?token|api[_-]?key|secret|password|passwd|client[_-]?secret|access[_-]?token|refresh[_-]?token)\s*[:=]\s*)(.+)/gi, "$1[REDACTED]");
  output = output.replace(/(<(?:Pass|Password|Token|Secret)[^>]*>)([^<]*)(<\/(?:Pass|Password|Token|Secret)>)/gi, "$1[REDACTED]$3");
  output = output.replace(/(("?(?:token|oauth[_-]?token|api[_-]?key|secret|password|passwd|client[_-]?secret|access[_-]?token|refresh[_-]?token)"?\s*:\s*")([^"]*)("))/gi, "$1[REDACTED]$4");
  output = output.replace(/^(HostName\s+)(.+)$/gim, "$1[REDACTED]");
  return output;
}

async function ensureCleanOutput() {
  await fs.rm(outConfigDir, { recursive: true, force: true });
  await fs.mkdir(outConfigDir, { recursive: true });
}

function shouldSkipPath(filePath) {
  const segments = filePath.split(path.sep);
  for (const segment of segments) {
    if (GLOBAL_DENY_SEGMENTS.has(segment)) return true;
  }
  if (GLOBAL_DENY_BASENAMES.has(path.basename(filePath))) return true;
  return false;
}

function isReadableTextFile(filePath) {
  const basename = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (basename.startsWith(".") && ext === "") {
    return TEXT_BASENAMES.has(basename);
  }
  if (TEXT_BASENAMES.has(basename)) return true;
  if (TEXT_EXTENSIONS.has(ext)) return true;
  return false;
}

async function safeReadText(filePath) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return null;
    if (stat.size > MAX_FILE_SIZE_BYTES) return null;
    const buffer = await fs.readFile(filePath);
    if (buffer.includes(0)) return null;
    return buffer.toString("utf-8");
  } catch {
    return null;
  }
}

async function collectDirFiles(dir) {
  const found = [];
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    let children;
    try {
      children = await fs.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const child of children) {
      const absolute = path.join(current, child.name);
      if (child.isDirectory()) {
        if (GLOBAL_DENY_SEGMENTS.has(child.name)) continue;
        stack.push(absolute);
      } else if (child.isFile()) {
        if (shouldSkipPath(absolute)) continue;
        found.push(absolute);
      }
    }
  }
  return found;
}

function makeId(storedPath) {
  return storedPath
    .replaceAll("/", "-")
    .replaceAll(".", "-")
    .replaceAll(" ", "-")
    .toLowerCase();
}

/**
 * Importance score: higher = more critical when bootstrapping a fresh machine.
 * Drives the "Essentials" section + within-category ordering on the website.
 */
function computePriority(meta) {
  if (typeof meta.priority === "number") return meta.priority;
  const stored = meta.storedPath ?? "";
  const base = stored.split("/").pop() ?? "";

  // Foundational shell + identity files
  if (/(^|\/)(zshrc|zprofile|p10k\.zsh|bashrc|bash_profile)$/.test(stored)) return 100;
  if (base === "gitconfig" || base === "jgit-config") return 95;
  if (base === "ssh-config") return 95;

  // Primary editor user settings
  if (/editor\/(vscode|cursor|zed)\/settings\.json$/.test(stored)) return 90;
  if (/editor\/(vscode|cursor)\/keybindings\.json$/.test(stored)) return 82;
  if (/editor\/(vscode|cursor)\/argv\.json$/.test(stored)) return 60;

  // Power tooling configs
  if (/containers\/docker-config\.json$/.test(stored)) return 70;
  if (/ai\/gemini-settings\.json$/.test(stored)) return 65;
  if (stored.startsWith("editor/nvim/init")) return 75;

  // JetBrains: keymaps + the most used options files
  if (/editor\/(intellij|clion|datagrip)\/keymaps\//.test(stored)) return 70;
  if (/editor\/(intellij|clion|datagrip)\/options\/(editor|keymap|colors\.scheme|ide\.general|code\.style|laf|terminal|editor-font)\.xml$/.test(stored))
    return 65;
  if (/editor\/(intellij|clion|datagrip)\/colors\//.test(stored)) return 55;
  if (/editor\/(intellij|clion|datagrip)\/codestyles\//.test(stored)) return 55;

  // Notes: vault root settings (app.json, appearance.json, hotkeys.json) trump per-plugin data
  if (/notes\/obsidian\/[^/]+\/\.obsidian\/(app|appearance|hotkeys|core-plugins|community-plugins|workspace)\.json$/.test(stored))
    return 50;

  // Everything else: weak default. Mod-score still drives the rest of the order.
  return 0;
}

async function writeEntry(rawContent, meta, entries, idsSeen) {
  const sanitized = withPlaceholders(sanitize(rawContent));
  const absoluteOut = path.join(outConfigDir, meta.storedPath);
  await fs.mkdir(path.dirname(absoluteOut), { recursive: true });
  await fs.writeFile(absoluteOut, sanitized, "utf-8");

  let id = makeId(meta.storedPath);
  let suffix = 2;
  while (idsSeen.has(id)) {
    id = `${makeId(meta.storedPath)}-${suffix++}`;
  }
  idsSeen.add(id);

  const size = Buffer.byteLength(sanitized, "utf-8");
  const lines = sanitized.length === 0 ? 0 : sanitized.split("\n").length;

  const priority = computePriority(meta);

  const entry = {
    id,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    sourcePath: meta.sourcePath,
    storedPath: meta.storedPath,
    targetPath: meta.targetPath,
    tags: Array.from(new Set(meta.tags)),
    checksum: checksum(sanitized),
    updatedAt: new Date().toISOString(),
    size,
    lines,
  };
  if (meta.group) {
    entry.group = meta.group;
  }
  if (priority > 0) {
    entry.priority = priority;
  }
  entries.push(entry);
}

function prettyTitleFromRel(prefix, rel) {
  const base = path.basename(rel);
  if (rel.includes("/") || rel.includes(path.sep)) {
    return `${prefix} · ${rel.replaceAll(path.sep, "/")}`;
  }
  return `${prefix} · ${base}`;
}

async function importExplicitFiles(entries, idsSeen) {
  for (const tuple of FILES) {
    const [sourcePath, storedPath, targetPath, category, title, description, tags, group] = tuple;
    const absolute = resolveHome(sourcePath);
    if (shouldSkipPath(absolute)) continue;
    const content = await safeReadText(absolute);
    if (content === null) continue;
    await writeEntry(
      content,
      { sourcePath, storedPath, targetPath, category, title, description, tags, group },
      entries,
      idsSeen,
    );
  }
}

async function importDirectories(entries, idsSeen) {
  for (const dir of DIRECTORIES) {
    const absoluteDir = resolveHome(dir.sourcePath);
    let exists = true;
    try {
      await fs.access(absoluteDir);
    } catch {
      exists = false;
    }
    if (!exists) continue;

    const files = await collectDirFiles(absoluteDir);
    for (const filePath of files) {
      const rel = path.relative(absoluteDir, filePath);
      const segments = rel.split(path.sep);
      if (dir.skipSegments?.some((segment) => segments.includes(segment))) continue;
      if (dir.allowBasenames && !dir.allowBasenames.includes(path.basename(filePath))) continue;
      if (!isReadableTextFile(filePath)) continue;
      const content = await safeReadText(filePath);
      if (content === null) continue;

      const sourcePath = path.posix.join(dir.sourcePath, rel.replaceAll(path.sep, "/"));
      const storedPath = path.posix.join(dir.storePrefix, rel.replaceAll(path.sep, "/"));
      const targetPath = path.posix.join(dir.targetPrefix, rel.replaceAll(path.sep, "/"));
      const prefixLabel = dir.storePrefix.split("/").slice(-2).join("/");

      await writeEntry(
        content,
        {
          sourcePath,
          storedPath,
          targetPath,
          title: prettyTitleFromRel(prefixLabel, rel),
          description: `Imported from ${dir.sourcePath}.`,
          category: dir.category,
          tags: dir.tags,
          group: dir.group,
        },
        entries,
        idsSeen,
      );
    }
  }
}

async function importObsidianVaults(entries, idsSeen) {
  for (const vault of OBSIDIAN_VAULTS) {
    const absoluteDir = resolveHome(vault.sourcePath);
    let exists = true;
    try {
      await fs.access(absoluteDir);
    } catch {
      exists = false;
    }
    if (!exists) continue;

    const files = await collectDirFiles(absoluteDir);
    for (const filePath of files) {
      const rel = path.relative(absoluteDir, filePath);
      if (rel.startsWith("plugins/") || rel.startsWith("themes/") || rel.startsWith("icons/")) {
        // Only allow plugin manifests and data; skip icons and large theme bundles.
        if (rel.startsWith("icons/")) continue;
        if (path.basename(filePath) !== "manifest.json" && path.basename(filePath) !== "data.json") continue;
      } else if (!OBSIDIAN_ALLOW_BASENAMES.has(path.basename(filePath)) && !rel.startsWith("snippets/")) {
        continue;
      }
      if (rel.startsWith("snippets/") && path.extname(filePath) !== ".css") continue;
      if (!isReadableTextFile(filePath)) continue;
      const content = await safeReadText(filePath);
      if (content === null) continue;

      const relPosix = rel.replaceAll(path.sep, "/");
      const sourcePath = path.posix.join(vault.sourcePath, relPosix);
      const storedPath = path.posix.join(vault.storePrefix, relPosix);
      const targetPath = path.posix.join(vault.targetPrefix, relPosix);

      await writeEntry(
        content,
        {
          sourcePath,
          storedPath,
          targetPath,
          title: `Obsidian · ${vault.label} · ${relPosix}`,
          description: `Obsidian vault settings for ${vault.label}.`,
          category: "notes",
          tags: ["obsidian", "notes", vault.label.toLowerCase().replaceAll(" ", "-")],
          group: `Obsidian · ${vault.label}`,
        },
        entries,
        idsSeen,
      );
    }
  }
}

async function run() {
  await ensureCleanOutput();
  const entries = [];
  const idsSeen = new Set();

  await importExplicitFiles(entries, idsSeen);
  await importDirectories(entries, idsSeen);
  await importObsidianVaults(entries, idsSeen);

  const manifest = {
    version: "1",
    generatedAt: new Date().toISOString(),
    entries: entries.sort((a, b) => a.title.localeCompare(b.title)),
  };

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");

  const byCategory = manifest.entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`Imported ${manifest.entries.length} config entries:`);
  for (const [category, count] of Object.entries(byCategory).sort()) {
    console.log(`  ${category.padEnd(10)} ${count}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
