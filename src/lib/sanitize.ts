const REDACTED = "[REDACTED]";

const INLINE_PATTERNS: RegExp[] = [
  /\b(ghp|gho|ghu|ghs|ghr|github_pat|glpat|sk|xoxb|xoxp|xoxa|xoxs|xoxr|AIza)[A-Za-z0-9_\-]{10,}\b/g,
  /\b[A-Za-z0-9+/_-]{32,}={0,2}\b/g,
];

const KV_PATTERNS: Array<{ regex: RegExp; valueGroup: number }> = [
  {
    regex: /((?:token|oauth[_-]?token|access[_-]?token|refresh[_-]?token|api[_-]?key|secret|password|passwd|client[_-]?secret)\s*[:=]\s*)(.+)/gi,
    valueGroup: 2,
  },
  {
    regex: /(<(?:Pass|Password|Token|Secret)[^>]*>)([^<]*)(<\/(?:Pass|Password|Token|Secret)>)/gi,
    valueGroup: 2,
  },
  {
    regex: /(("?(?:token|oauth[_-]?token|access[_-]?token|refresh[_-]?token|api[_-]?key|secret|password|passwd|client[_-]?secret)"?\s*:\s*")([^"]*)("))/gi,
    valueGroup: 3,
  },
];

export function sanitizeConfig(input: string) {
  let output = input;

  for (const pattern of INLINE_PATTERNS) {
    output = output.replace(pattern, REDACTED);
  }

  for (const entry of KV_PATTERNS) {
    output = output.replace(entry.regex, (...args: string[]) => {
      const matched = args[0];
      const value = args[entry.valueGroup];
      if (!value || value.trim().length === 0) {
        return matched;
      }
      return matched.replace(value, REDACTED);
    });
  }

  // Hide SSH host values for private infra while preserving structure.
  output = output.replace(/^(HostName\s+)(.+)$/gim, (_match, prefix: string) => {
    return `${prefix}${REDACTED}`;
  });

  return output;
}
