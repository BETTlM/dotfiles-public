/**
 * Maps file extensions to Prism language IDs that ship with react-syntax-highlighter.
 * Extensions are stored lowercase, including the leading dot.
 */
const EXTENSION_LANGUAGE: Record<string, string> = {
  // Shell / scripts
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "bash",
  ".zshrc": "bash",
  ".zprofile": "bash",
  ".bashrc": "bash",
  ".profile": "bash",
  ".fish": "bash",
  ".ksh": "bash",
  ".csh": "bash",
  ".ps1": "powershell",
  ".bat": "batch",
  ".cmd": "batch",

  // Programming languages
  ".lua": "lua",
  ".py": "python",
  ".rb": "ruby",
  ".rs": "rust",
  ".go": "go",
  ".c": "c",
  ".h": "c",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".cxx": "cpp",
  ".hpp": "cpp",
  ".hs": "haskell",
  ".java": "java",
  ".kt": "kotlin",
  ".kts": "kotlin",
  ".swift": "swift",
  ".sql": "sql",
  ".m": "objectivec",
  ".mm": "objectivec",
  ".dart": "dart",
  ".php": "php",
  ".pl": "perl",
  ".r": "r",

  // JavaScript family
  ".js": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".jsx": "jsx",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".vue": "markup",
  ".svelte": "markup",

  // Web
  ".html": "markup",
  ".htm": "markup",
  ".xhtml": "markup",
  ".css": "css",
  ".scss": "scss",
  ".sass": "scss",
  ".less": "less",

  // Data / structured config
  ".json": "json",
  ".jsonc": "json",
  ".json5": "json",
  ".code-snippets": "json",
  ".webmanifest": "json",
  ".geojson": "json",
  ".xml": "markup",
  ".xsd": "markup",
  ".xsl": "markup",
  ".xslt": "markup",
  ".plist": "markup",
  ".icls": "markup",
  ".tmTheme": "markup",
  ".tmlanguage": "markup",
  ".storyboard": "markup",
  ".rss": "markup",
  ".atom": "markup",
  ".svg": "markup",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
  ".ini": "ini",
  ".cfg": "ini",
  ".properties": "properties",
  ".desktop": "ini",
  ".gitconfig": "ini",
  ".editorconfig": "ini",
  ".env": "bash",

  // Conf-style — most use INI/key=value semantics
  ".conf": "ini",
  ".config": "ini",
  ".vmoptions": "ini",

  // Docs
  ".md": "markdown",
  ".markdown": "markdown",
  ".mdx": "markdown",
  ".rst": "rest",
  ".tex": "latex",

  // Diff / patch
  ".diff": "diff",
  ".patch": "diff",

  // Misc text
  ".txt": "text",
  ".log": "log",
  ".csv": "text",
  ".tsv": "text",
};

/**
 * Some files are identified by their full base name (no extension or special name).
 * Lookup is also retried without a leading dot so we match files like
 * `shell/zshrc` (the importer strips leading dots).
 */
const BASENAME_LANGUAGE: Record<string, string> = {
  ".zshrc": "bash",
  ".zprofile": "bash",
  ".bashrc": "bash",
  ".bash_profile": "bash",
  ".profile": "bash",
  ".inputrc": "bash",
  ".gitconfig": "ini",
  ".gitattributes": "ini",
  ".gitignore": "bash",
  ".dockerignore": "bash",
  ".npmrc": "ini",
  ".yarnrc": "ini",
  ".env": "bash",
  ".editorconfig": "ini",
  sketchybarrc: "bash",
  Brewfile: "ruby",
  Dockerfile: "docker",
  Procfile: "yaml",
  Makefile: "makefile",
  GNUmakefile: "makefile",
  CMakeLists: "cmake",
  Vagrantfile: "ruby",
  Gemfile: "ruby",
  Rakefile: "ruby",
  config: "ini",
  "jgit-config": "ini",
  "ssh-config": "ini",
};

const SHEBANG_LANGUAGE: Array<{ pattern: RegExp; language: string }> = [
  { pattern: /\bzsh\b/, language: "bash" },
  { pattern: /\bbash\b/, language: "bash" },
  { pattern: /\bsh\b/, language: "bash" },
  { pattern: /\bfish\b/, language: "bash" },
  { pattern: /\bpython[0-9.]*/, language: "python" },
  { pattern: /\bnode/, language: "javascript" },
  { pattern: /\bdeno/, language: "typescript" },
  { pattern: /\bbun/, language: "typescript" },
  { pattern: /\bruby/, language: "ruby" },
  { pattern: /\bperl/, language: "perl" },
  { pattern: /\blua/, language: "lua" },
  { pattern: /\bawk/, language: "bash" },
];

function detectShebang(content?: string): string | null {
  if (!content) return null;
  const firstLine = content.split("\n", 1)[0];
  if (!firstLine?.startsWith("#!")) return null;
  for (const entry of SHEBANG_LANGUAGE) {
    if (entry.pattern.test(firstLine)) return entry.language;
  }
  return null;
}

function detectByContentHeuristics(content?: string): string | null {
  if (!content) return null;
  const trimmed = content.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("<?xml") || /^<[a-zA-Z!?]/.test(trimmed)) {
    return "markup";
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      // Fall through; many JSONC configs include comments.
      if (/^\s*[{[]/.test(trimmed)) return "json";
    }
  }
  if (/^---\s*$/m.test(trimmed.split("\n", 3).join("\n"))) {
    return "yaml";
  }
  if (/^\s*\[[^\]]+\]\s*$/m.test(trimmed)) {
    return "ini";
  }
  return null;
}

/**
 * Infer a Prism language ID for syntax highlighting.
 *
 * Resolution order:
 *   1. Exact basename mapping (e.g., Dockerfile, Makefile, sketchybarrc).
 *   2. File extension mapping (lowercased).
 *   3. Shebang detection from the first line of content.
 *   4. Lightweight content heuristics (XML, JSON, YAML, INI).
 *   5. Fallback to "text".
 */
export function inferLanguage(filePath: string, content?: string): string {
  const base = filePath.split("/").pop() ?? filePath;

  if (BASENAME_LANGUAGE[base]) {
    return BASENAME_LANGUAGE[base];
  }
  // Importer may strip leading dots; retry with a dot prefix.
  const dotted = `.${base}`;
  if (BASENAME_LANGUAGE[dotted]) {
    return BASENAME_LANGUAGE[dotted];
  }

  const dotIndex = base.lastIndexOf(".");
  if (dotIndex > 0) {
    const ext = base.slice(dotIndex).toLowerCase();
    if (EXTENSION_LANGUAGE[ext]) {
      return EXTENSION_LANGUAGE[ext];
    }
  } else if (base.startsWith(".") && EXTENSION_LANGUAGE[base.toLowerCase()]) {
    return EXTENSION_LANGUAGE[base.toLowerCase()];
  }

  const shebang = detectShebang(content);
  if (shebang) return shebang;

  const heuristic = detectByContentHeuristics(content);
  if (heuristic) return heuristic;

  return "text";
}
