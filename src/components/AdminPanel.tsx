"use client";

import { useMemo, useState } from "react";

import type { ConfigEntry } from "@/lib/types";

interface AdminPanelProps {
  entries: ConfigEntry[];
}

const EMPTY_FORM = {
  id: "",
  title: "",
  description: "",
  category: "other" as ConfigEntry["category"],
  sourcePath: "",
  storedPath: "",
  targetPath: "",
  tags: "",
  content: "",
};

const CATEGORY_OPTIONS: ConfigEntry["category"][] = [
  "shell",
  "editor",
  "terminal",
  "ui",
  "network",
  "git",
  "notes",
  "other",
];

type StatusKind = "idle" | "success" | "error";

export function AdminPanel({ entries }: AdminPanelProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<{ kind: StatusKind; text: string }>({ kind: "idle", text: "" });
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");

  const sorted = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return [...entries]
      .sort((a, b) => a.title.localeCompare(b.title))
      .filter((entry) => {
        if (!q) return true;
        return [entry.title, entry.id, entry.category, entry.storedPath, entry.targetPath]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
  }, [entries, filter]);

  function loadIntoForm(entry: ConfigEntry) {
    setForm({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      category: entry.category,
      sourcePath: entry.sourcePath,
      storedPath: entry.storedPath,
      targetPath: entry.targetPath,
      tags: entry.tags.join(", "),
      content: "",
    });
    setStatus({ kind: "idle", text: "Loaded into form. Paste new content to update." });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function saveConfig() {
    if (!form.id || !form.storedPath) {
      setStatus({ kind: "error", text: "ID and stored path are required." });
      return;
    }
    setBusy(true);
    setStatus({ kind: "idle", text: "" });
    try {
      const res = await fetch("/api/admin/configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setStatus({ kind: "success", text: "Saved. Refresh to see changes." });
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "Save failed." });
    } finally {
      setBusy(false);
    }
  }

  async function removeConfig(id: string) {
    setBusy(true);
    setStatus({ kind: "idle", text: "" });
    try {
      const res = await fetch(`/api/admin/configs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setStatus({ kind: "success", text: `Deleted ${id}. Refresh to see updates.` });
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "Delete failed." });
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setStatus({ kind: "idle", text: "" });
  }

  return (
    <div className="adminLayout">
      <section className="panel">
        <header className="panelHeader">
          <div>
            <h2 className="panelTitle">Config forge</h2>
            <p className="panelSubtitle">
              Create or update an entry. Sensitive values and absolute paths are normalized server-side.
            </p>
          </div>
          <button type="button" className="btn btnGhost" onClick={resetForm} disabled={busy}>
            Reset
          </button>
        </header>
        <div className="panelBody">
          <div className="formGrid">
            <div className="formField">
              <label className="formLabel" htmlFor="id">
                ID
              </label>
              <input
                id="id"
                className="formInput"
                value={form.id}
                onChange={(event) => setForm({ ...form, id: event.target.value })}
                placeholder="e.g. shell-zshrc"
              />
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="formInput"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Display title in the archive"
              />
            </div>
            <div className="formField full">
              <label className="formLabel" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                className="formInput"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Short text shown on the catalog card"
              />
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="formSelect"
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value as ConfigEntry["category"] })
                }
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="tags">
                Tags
              </label>
              <input
                id="tags"
                className="formInput"
                value={form.tags}
                onChange={(event) => setForm({ ...form, tags: event.target.value })}
                placeholder="comma, separated"
              />
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="sourcePath">
                Source path
              </label>
              <input
                id="sourcePath"
                className="formInput"
                value={form.sourcePath}
                onChange={(event) => setForm({ ...form, sourcePath: event.target.value })}
                placeholder="~/.config/app/file"
              />
            </div>
            <div className="formField">
              <label className="formLabel" htmlFor="storedPath">
                Stored path
              </label>
              <input
                id="storedPath"
                className="formInput"
                value={form.storedPath}
                onChange={(event) => setForm({ ...form, storedPath: event.target.value })}
                placeholder="category/file"
              />
            </div>
            <div className="formField full">
              <label className="formLabel" htmlFor="targetPath">
                Target install path
              </label>
              <input
                id="targetPath"
                className="formInput"
                value={form.targetPath}
                onChange={(event) => setForm({ ...form, targetPath: event.target.value })}
                placeholder="Where this file is written on a fresh machine"
              />
            </div>
            <div className="formField full">
              <label className="formLabel" htmlFor="content">
                Raw content
              </label>
              <textarea
                id="content"
                className="formTextarea"
                value={form.content}
                onChange={(event) => setForm({ ...form, content: event.target.value })}
                placeholder="Paste raw config content. Server sanitizes and applies placeholders."
                spellCheck={false}
              />
            </div>
          </div>
          <div className="formActions">
            <p className={`statusMsg ${status.kind === "idle" ? "" : status.kind}`}>{status.text}</p>
            <button type="button" className="btn btnPrimary" onClick={saveConfig} disabled={busy}>
              {busy ? "Saving..." : "Save config"}
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <header className="panelHeader">
          <div>
            <h2 className="panelTitle">Existing configs</h2>
            <p className="panelSubtitle">{entries.length} configs in the catalog</p>
          </div>
        </header>
        <div className="panelBody" style={{ paddingBottom: 0 }}>
          <input
            type="text"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="formInput"
            placeholder="Filter by title, id, or path"
            style={{ marginBottom: "1rem" }}
          />
        </div>
        <div className="entryList">
          {sorted.map((entry) => (
            <div key={entry.id} className="entryRow">
              <div className="entryInfo">
                <p className="entryTitle">{entry.title}</p>
                <p className="entryPath">{entry.storedPath}</p>
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  className="btn btnGhost"
                  onClick={() => loadIntoForm(entry)}
                  disabled={busy}
                  style={{ padding: "0.45rem 0.7rem", fontSize: "0.82rem" }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btnDanger"
                  onClick={() => removeConfig(entry.id)}
                  disabled={busy}
                  style={{ padding: "0.45rem 0.7rem", fontSize: "0.82rem" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {sorted.length === 0 ? (
            <div className="emptyState" style={{ padding: "2.5rem 1rem" }}>
              <h3>No matches</h3>
              <p>No matches. Try another filter.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
