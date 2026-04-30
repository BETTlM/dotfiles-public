"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

function ArrowDownTrayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

type ModLevel = "heavy" | "moderate" | "light" | "vanilla";

interface CatalogEntry extends ConfigEntry {
  modScore: number;
  modLevel: ModLevel;
  /** Resolved priority — 0 when not assigned. */
  priorityScore: number;
}

const ESSENTIAL_THRESHOLD = 70;
const ESSENTIAL_MAX_DISPLAY = 12;

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

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
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

function EntryCard({ entry, featured = false }: { entry: CatalogEntry; featured?: boolean }) {
  return (
    <article className={`card${featured ? " card--featured" : ""}`}>
      <div className="cardTop">
        <span className="cardIcon">{fileExtension(entry.storedPath)}</span>
        <div className="cardTopBadges">
          {entry.priorityScore >= ESSENTIAL_THRESHOLD ? (
            <span className="essentialBadge" title={`Priority ${entry.priorityScore}`}>
              <StarIcon />
              Main quest
            </span>
          ) : null}
          <span
            className={`modBadge mod-${entry.modLevel}`}
            title={`${entry.lines} lines · ${formatSize(entry.size)}`}
          >
            <span className="modDot" />
            {MOD_LEVEL_LABEL[entry.modLevel]}
          </span>
        </div>
      </div>
      <h3 className="cardTitle">{entry.title}</h3>
      <p className="cardDesc">{entry.description}</p>
      {entry.tags.length > 0 ? (
        <div className="tagRow">
          {entry.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="cardMeta">
        <code title={entry.targetPath}>{entry.targetPath}</code>
      </div>
      <div className="cardMetaRow">
        <span className="metaPill">{formatSize(entry.size)}</span>
        <span className="metaPill">{entry.lines} lines</span>
        {entry.group ? (
          <span className="metaPill">{entry.group}</span>
        ) : (
          <span className="metaPill subtle">{entry.category}</span>
        )}
      </div>
      <div className="cardActions">
        <Link href={`/config/${entry.id}`} className="cardBtn">
          <EyeIcon />
          Peek
        </Link>
        <Link href={`/download/${entry.id}`} className="cardBtn primary">
          <ArrowDownTrayIcon />
          Yoink
        </Link>
      </div>
    </article>
  );
}

export function Catalog({ entries }: CatalogProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL_FILTER);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

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

  return (
    <>
      <div className="toolbar">
        <div className="searchWrap">
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, tag, or path"
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

      <p className="muted" style={{ marginBottom: "1.25rem", fontSize: "0.82rem" }}>
        Top row is the no-cap critical stuff. Everything else is sorted by priority and how hard
        each config is customized.
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
              <div className="cardGrid">
                {essentials.map((entry) => (
                  <EntryCard key={`essential-${entry.id}`} entry={entry} featured />
                ))}
              </div>
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

                {section.subGroups.map((sub, idx) => (
                  <div key={`${section.category}-${sub.label ?? "none"}-${idx}`} className="subSection">
                    {(() => {
                      const groupKey = `${section.category}:${sub.label ?? "other"}:${idx}`;
                      const isCollapsed = collapsedGroups[groupKey] ?? false;
                      return (
                        <>
                    {showSubLabels ? (
                      <header className="subSectionHeader">
                        <button
                          type="button"
                          className="subSectionToggle"
                          onClick={() => toggleGroup(groupKey)}
                          aria-expanded={!isCollapsed}
                        >
                          <span className={`subSectionChevron${isCollapsed ? " collapsed" : ""}`}>
                            ▾
                          </span>
                        <h3 className="subSectionTitle">{sub.label ?? "Other stuff"}</h3>
                          <span className="subSectionCount">{sub.items.length} files</span>
                        </button>
                      </header>
                    ) : null}
                    {!isCollapsed ? (
                      <div className="cardGrid">
                        {sub.items.map((entry) => (
                          <EntryCard key={entry.id} entry={entry} />
                        ))}
                      </div>
                    ) : null}
                        </>
                      );
                    })()}
                  </div>
                ))}
              </section>
            );
          })}
        </>
      )}
    </>
  );
}
