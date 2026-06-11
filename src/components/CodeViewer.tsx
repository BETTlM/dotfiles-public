"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  code: string;
  language: string;
  filename?: string;
}

const customCodeStyle: React.CSSProperties = {
  background: "transparent",
  margin: 0,
  padding: "1.25rem",
  fontSize: "0.84rem",
  lineHeight: 1.6,
};

// Warm-toned token overrides so the highlighting sits on the charcoal palette
// instead of oneDark's cool blues.
const TOKEN_OVERRIDES: Record<string, React.CSSProperties> = {
  comment: { color: "#6e675a", fontStyle: "italic" },
  prolog: { color: "#6e675a" },
  doctype: { color: "#6e675a" },
  cdata: { color: "#6e675a" },
  punctuation: { color: "#8a8374" },
  property: { color: "#e8a14e" },
  tag: { color: "#cf6f5f" },
  boolean: { color: "#d98e6a" },
  number: { color: "#d98e6a" },
  constant: { color: "#d98e6a" },
  symbol: { color: "#d98e6a" },
  selector: { color: "#a3b97e" },
  "attr-name": { color: "#e6c98a" },
  string: { color: "#a3b97e" },
  char: { color: "#a3b97e" },
  builtin: { color: "#e6c98a" },
  inserted: { color: "#a3b97e" },
  operator: { color: "#b6ae9d" },
  entity: { color: "#e6c98a" },
  url: { color: "#a3b97e" },
  variable: { color: "#ebe4d5" },
  atrule: { color: "#e8a14e" },
  "attr-value": { color: "#a3b97e" },
  function: { color: "#e6c98a" },
  "class-name": { color: "#e6c98a" },
  keyword: { color: "#e8a14e" },
  regex: { color: "#d98e6a" },
  important: { color: "#cf6f5f", fontWeight: "bold" },
  deleted: { color: "#cf6f5f" },
};

const archiveTheme: Record<string, React.CSSProperties> = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "transparent",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    color: "#ebe4d5",
  },
};

for (const [token, style] of Object.entries(TOKEN_OVERRIDES)) {
  archiveTheme[token] = { ...(oneDark[token] as React.CSSProperties | undefined), ...style };
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CodeViewer({ code, language, filename }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  async function copyContent() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="codePanel">
      <div className="codePanelHeader">
        <div className="codePanelInfo">
          {filename ? <span className="codePanelFile">{filename}</span> : null}
          <span className="codePanelLang">{language}</span>
        </div>
        <button
          type="button"
          onClick={copyContent}
          className={`copyBtn ${copied ? "copied" : ""}`}
          aria-label="Copy rune"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "copied" : "copy rune"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={archiveTheme}
        customStyle={customCodeStyle}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
