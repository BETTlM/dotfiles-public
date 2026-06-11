"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { ConfigEntry } from "@/lib/types";

interface CatalogProps {
  entries: ConfigEntry[];
}

const ALL_FILTER = "all";
const OBSIDIAN_FILTER = "obsidian";

const EXTENSION_LABEL_OVERRIDES: Record<string, string> = {
  ".code-snippets": "SNIP",
  ".tmlanguage": "TMLNG",
  ".tmtheme": "TMTH",
  ".vmoptions": "VMOPT",
  ".markdown": "MD",
};

const BASENAME_LABEL_OVERRIDES: Record<string, string> = {
  zshrc: "ZSH",
  zprofile: "ZSH",
  bashrc: "BASH",
  gitconfig: "GIT",
  "jgit-config": "GIT",
  "ssh-config": "SSH",
  sketchybarrc: "SH",
  Dockerfile: "DOCK",
  Makefile: "MAKE",
  Brewfile: "BREW",
  Vagrantfile: "VAGR",
  Gemfile: "GEM",
  Procfile: "PROC",
  Rakefile: "RAKE",
  config: "CFG",
};

function fileExtension(storedPath: string) {
  const base = storedPath.split("/").pop() ?? storedPath;
  if (BASENAME_LABEL_OVERRIDES[base]) return BASENAME_LABEL_OVERRIDES[base];

  const dot = base.lastIndexOf(".");
  if (dot < 0) return base.slice(0, 4).toUpperCase();

  const ext = base.slice(dot).toLowerCase();
  if (EXTENSION_LABEL_OVERRIDES[ext]) return EXTENSION_LABEL_OVERRIDES[ext];

  return base.slice(dot + 1, dot + 6).toUpperCase();
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ============ SVG icon set ============ */

const ICON_PROPS = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function ShellIcon() {
  return (
    <svg {...ICON_PROPS}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function EditorIcon() {
  return (
    <svg {...ICON_PROPS}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="6 9 9 12 6 15" />
      <line x1="12" y1="15" x2="17" y2="15" />
    </svg>
  );
}

function UiIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function GitIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M6 8.5v7" />
      <path d="M18 15.5V12a4 4 0 0 0-4-4h-3" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, () => React.JSX.Element> = {
  shell: ShellIcon,
  editor: EditorIcon,
  terminal: TerminalIcon,
  ui: UiIcon,
  network: NetworkIcon,
  git: GitIcon,
  notes: NotesIcon,
};

function CategoryIcon({ category }: { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? FileIcon;
  return <Icon />;
}

function EyeIcon() {
  return (
    <svg {...ICON_PROPS} width={13} height={13}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg {...ICON_PROPS} width={13} height={13}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/* ============ Catalog ============ */

type ModLevel = "heavy" | "moderate" | "light" | "vanilla";

interface CatalogEntry extends ConfigEntry {
  modScore: number;
  modLevel: ModLevel;
  /** Resolved priority — 0 when not assigned. */
  priorityScore: number;
}

const ESSENTIAL_THRESHOLD = 70;
const ESSENTIAL_MAX_DISPLAY = 12;
const PREVIEW_TILE_COUNT = 5;

function classifyModLevel(size: number, lines: number): ModLevel {
  if (size >= 10_000 || lines >= 250) return "heavy";
  if (size >= 2_500 || lines >= 80) return "moderate";
  if (size >= 600 || lines >= 20) return "light";
  return "vanilla";
}

const MOD_LEVEL_LABEL: Record<ModLevel, string> = {
  heavy: "Max cooked",
  moderate: "Locked in",
  light: "Mild sauce",
  vanilla: "NPC default",
};

function trackPointer(event: React.MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

function EntryTile({
  entry,
  order,
  featured = false,
}: {
  entry: CatalogEntry;
  order: number;
  featured?: boolean;
}) {
  return (
    <article
      className={`tile${featured ? " tile--featured" : ""}`}
      onMouseMove={trackPointer}
      style={{ "--d": `${Math.min(order, 11) * 45}ms` } as React.CSSProperties}
    >
      <div className="tileHead">
        <span className="tileIcon">
          <CategoryIcon category={entry.category} />
        </span>
        <span className="tileExt">{fileExtension(entry.storedPath)}</span>
        <div className="tileHeadRight">
          {entry.priorityScore >= ESSENTIAL_THRESHOLD ? (
            <span className="tileStar" title={`Priority ${entry.priorityScore}`}>
              <StarIcon />
              Main quest
            </span>
          ) : null}
          <span
            className={`modMark mod-${entry.modLevel}`}
            title={`${entry.lines} lines · ${formatSize(entry.size)}`}
          >
            <span className="modDot" />
            {MOD_LEVEL_LABEL[entry.modLevel]}
          </span>
        </div>
      </div>
      <Link href={`/config/${entry.id}`} className="tileTitle">
        {entry.title}
      </Link>
      <p className="tileDesc">{entry.description}</p>
      {entry.tags.length > 0 ? (
        <div className="tileTags">
          {entry.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
      <code className="tilePath" title={entry.targetPath}>
        {entry.targetPath}
      </code>
      <div className="tileFoot">
        <div className="tileMeta">
          <span>{formatSize(entry.size)}</span>
          <span>{entry.lines} ln</span>
          <span className="dim">{entry.group ?? entry.category}</span>
        </div>
        <div className="tileActions">
          <Link href={`/config/${entry.id}`} className="tileAction">
            <EyeIcon />
            peek
          </Link>
          <Link href={`/download/${entry.id}`} className="tileAction primary">
            <DownloadIcon />
            yoink
          </Link>
        </div>
      </div>
    </article>
  );
}

function ExpandIcon() {
  return (
    <svg {...ICON_PROPS} width={22} height={22}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg {...ICON_PROPS} width={22} height={22}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ExpandTile({
  hiddenCount,
  total,
  onClick,
  order,
}: {
  hiddenCount: number;
  total: number;
  onClick: () => void;
  order: number;
}) {
  return (
    <button
      type="button"
      className="tile tileExpand"
      onClick={onClick}
      onMouseMove={trackPointer}
      aria-expanded={false}
      aria-label={`Show all ${total} configs in this section`}
      style={{ "--d": `${Math.min(order, 11) * 45}ms` } as React.CSSProperties}
    >
      <span className="tileExpandIcon">
        <ExpandIcon />
      </span>
      <span className="tileExpandCount">+{hiddenCount}</span>
      <span className="tileExpandLabel">more configs locked in here</span>
      <span className="tileExpandAction">show all {total}</span>
    </button>
  );
}

function CollapseTile({ onClick, order }: { onClick: () => void; order: number }) {
  return (
    <button
      type="button"
      className="tile tileExpand tileExpand--collapse"
      onClick={onClick}
      onMouseMove={trackPointer}
      aria-expanded={true}
      aria-label="Show fewer configs"
      style={{ "--d": `${Math.min(order, 11) * 45}ms` } as React.CSSProperties}
    >
      <span className="tileExpandIcon">
        <CollapseIcon />
      </span>
      <span className="tileExpandLabel">full stash unlocked</span>
      <span className="tileExpandAction">show less</span>
    </button>
  );
}

function TileGrid({
  items,
  gridKey,
  expanded,
  onToggleExpand,
  featured = false,
}: {
  items: CatalogEntry[];
  gridKey: string;
  expanded: boolean;
  onToggleExpand: (key: string) => void;
  featured?: boolean;
}) {
  const hasOverflow = items.length > PREVIEW_TILE_COUNT;
  const visible = expanded || !hasOverflow ? items : items.slice(0, PREVIEW_TILE_COUNT);
  const hiddenCount = items.length - PREVIEW_TILE_COUNT;

  return (
    <div className="tileGrid" data-grid={gridKey}>
      {visible.map((entry, i) => (
        <EntryTile key={entry.id} entry={entry} order={i} featured={featured} />
      ))}
      {hasOverflow && !expanded ? (
        <ExpandTile
          hiddenCount={hiddenCount}
          total={items.length}
          onClick={() => onToggleExpand(gridKey)}
          order={PREVIEW_TILE_COUNT}
        />
      ) : null}
      {hasOverflow && expanded ? (
        <CollapseTile onClick={() => onToggleExpand(gridKey)} order={visible.length} />
      ) : null}
    </div>
  );
}

export function Catalog({ entries }: CatalogProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL_FILTER);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [expandedGrids, setExpandedGrids] = useState<Record<string, boolean>>({});

  const enriched: CatalogEntry[] = useMemo(
    () =>
      entries.map((entry) => {
        const size = entry.size ?? 0;
        const lines = entry.lines ?? 0;
        return {
          ...entry,
          modScore: size + lines * 12,
          modLevel: classifyModLevel(size, lines),
          priorityScore: entry.priority ?? 0,
        };
      }),
    [entries],
  );

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of enriched) {
      counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    }
    const obsidianCount = enriched.filter(
      (entry) => entry.tags.includes("obsidian") || entry.group?.startsWith("Obsidian"),
    ).length;
    return [
      { id: ALL_FILTER, label: "all", count: enriched.length },
      ...(obsidianCount > 0
        ? [{ id: OBSIDIAN_FILTER, label: "obsidian", count: obsidianCount }]
        : []),
      ...Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id, count]) => ({ id, label: id, count })),
    ];
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((entry) => {
      if (activeCategory !== ALL_FILTER) {
        if (activeCategory === OBSIDIAN_FILTER) {
          const isObsidian =
            entry.tags.includes("obsidian") || entry.group?.startsWith("Obsidian");
          if (!isObsidian) return false;
        } else if (entry.category !== activeCategory) {
          return false;
        }
      }
      if (!q) return true;
      const haystack = [
        entry.title,
        entry.description,
        entry.id,
        entry.category,
        entry.targetPath,
        entry.storedPath,
        entry.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [enriched, query, activeCategory]);

  type SubGroup = {
    label: string | null;
    items: CatalogEntry[];
    topScore: number;
    topPriority: number;
  };
  type CategorySection = {
    category: string;
    total: number;
    subGroups: SubGroup[];
    topScore: number;
    topPriority: number;
  };

  const compareEntries = (a: CatalogEntry, b: CatalogEntry) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
    return b.modScore - a.modScore;
  };

  const essentials = useMemo(() => {
    return [...filtered]
      .filter((entry) => entry.priorityScore >= ESSENTIAL_THRESHOLD)
      .sort(compareEntries)
      .slice(0, ESSENTIAL_MAX_DISPLAY);
  }, [filtered]);

  const grouped: CategorySection[] = useMemo(() => {
    const byCategory = new Map<string, CatalogEntry[]>();
    for (const entry of filtered) {
      const list = byCategory.get(entry.category) ?? [];
      list.push(entry);
      byCategory.set(entry.category, list);
    }

    const sections: CategorySection[] = [];
    for (const [category, items] of byCategory.entries()) {
      const subMap = new Map<string | null, CatalogEntry[]>();
      for (const entry of items) {
        const key = entry.group ?? null;
        const list = subMap.get(key) ?? [];
        list.push(entry);
        subMap.set(key, list);
      }
      const subGroups: SubGroup[] = Array.from(subMap.entries()).map(([label, groupItems]) => {
        const sortedItems = [...groupItems].sort(compareEntries);
        return {
          label,
          items: sortedItems,
          topScore: sortedItems[0]?.modScore ?? 0,
          topPriority: sortedItems[0]?.priorityScore ?? 0,
        };
      });
      subGroups.sort((a, b) => {
        // Untagged items go last so the named groups (vaults / IDEs) lead.
        if (a.label === null && b.label !== null) return 1;
        if (b.label === null && a.label !== null) return -1;
        if (b.topPriority !== a.topPriority) return b.topPriority - a.topPriority;
        return b.topScore - a.topScore;
      });
      const topScore = subGroups.reduce((max, sub) => Math.max(max, sub.topScore), 0);
      const topPriority = subGroups.reduce((max, sub) => Math.max(max, sub.topPriority), 0);
      sections.push({ category, total: items.length, subGroups, topScore, topPriority });
    }
    sections.sort((a, b) => {
      if (b.topPriority !== a.topPriority) return b.topPriority - a.topPriority;
      return b.topScore - a.topScore;
    });
    return sections;
  }, [filtered]);

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const toggleGridExpand = (gridKey: string) => {
    setExpandedGrids((prev) => ({
      ...prev,
      [gridKey]: !prev[gridKey],
    }));
  };

  const filterKey = `${activeCategory}:${query.trim().toLowerCase()}`;

  useEffect(() => {
    setExpandedGrids({});
  }, [filterKey]);

  return (
    <>
      <div className="toolbar">
        <div className="searchWrap">
          <span className="searchPrompt" aria-hidden="true">
            &gt;
          </span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="search by name, tag, or path"
            className="searchInput"
            spellCheck={false}
          />
        </div>
        <div className="chipRow">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`chip ${activeCategory === category.id ? "active" : ""}`}
            >
              <span>{category.label}</span>
              <span className="chipCount">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="muted" style={{ marginBottom: "2rem", fontSize: "0.76rem" }}>
        // Top row is the no-cap critical stuff. Everything else is sorted by priority and how
        hard each config is customized.
      </p>

      {grouped.length === 0 ? (
        <div className="emptyState">
          <h3>No matches</h3>
          <p>No hits. Try another search.</p>
        </div>
      ) : (
        <>
          {essentials.length > 0 ? (
            <section className="section section--essentials">
              <header className="sectionHeader essentialsHeader">
                <div className="sectionTitleGroup">
                  <span className="essentialsBadge">
                    <StarIcon />
                    Main Quest
                  </span>
                  <h2 className="sectionTitle">High-priority loadout</h2>
                  <span className="sectionCount">{essentials.length} pinned</span>
                </div>
                <p className="essentialsSubtitle">
                  Start here on a fresh machine and future-you avoids instant tilt.
                </p>
              </header>
              <TileGrid
                items={essentials}
                gridKey="essentials:main"
                expanded={expandedGrids["essentials:main"] ?? false}
                onToggleExpand={toggleGridExpand}
                featured
              />
            </section>
          ) : null}

          {grouped.map((section) => {
            const showSubLabels =
              section.subGroups.length > 1 || (section.subGroups[0]?.label ?? null) !== null;
            return (
              <section key={section.category} className="section">
                <header className="sectionHeader">
                  <div className="sectionTitleGroup">
                    <h2 className="sectionTitle">{section.category}</h2>
                    <span className="sectionCount">{section.total} files</span>
                  </div>
                </header>

                {section.subGroups.map((sub, idx) => {
                  const groupKey = `${section.category}:${sub.label ?? "other"}:${idx}`;
                  const isCollapsed = collapsedGroups[groupKey] ?? false;
                  return (
                    <div
                      key={`${section.category}-${sub.label ?? "none"}-${idx}`}
                      className="subSection"
                    >
                      {showSubLabels ? (
                        <header className="subSectionHeader">
                          <button
                            type="button"
                            className="subSectionToggle"
                            onClick={() => toggleGroup(groupKey)}
                            aria-expanded={!isCollapsed}
                          >
                            <span className="subSectionChevron">
                              {isCollapsed ? "[+]" : "[-]"}
                            </span>
                            <h3 className="subSectionTitle">{sub.label ?? "Other stuff"}</h3>
                            <span className="subSectionCount">{sub.items.length} files</span>
                          </button>
                        </header>
                      ) : null}
                      <div className={`collapseWrap${isCollapsed ? " collapsed" : ""}`}>
                        <div>
                          <TileGrid
                            items={sub.items}
                            gridKey={groupKey}
                            expanded={expandedGrids[groupKey] ?? false}
                            onToggleExpand={toggleGridExpand}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </>
      )}
    </>
  );
}
