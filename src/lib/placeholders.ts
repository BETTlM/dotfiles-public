export interface PlaceholderContext {
  username?: string;
  homeDir?: string;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function applyPlaceholders(input: string, ctx: PlaceholderContext = {}) {
  const username = ctx.username ?? process.env.CONFIG_USERNAME ?? "user";
  const homeDir = ctx.homeDir ?? process.env.CONFIG_HOME_DIR ?? `/Users/${username}`;

  let output = input;

  const replacements: Array<[RegExp, string]> = [
    [new RegExp(escapeRegExp(homeDir), "g"), "{{HOME}}"],
    [new RegExp(`/Users/${escapeRegExp(username)}`, "g"), "{{HOME}}"],
    [new RegExp(`/home/${escapeRegExp(username)}`, "g"), "{{HOME}}"],
    [new RegExp(`\\b${escapeRegExp(username)}\\b`, "g"), "{{USERNAME}}"],
  ];

  for (const [pattern, token] of replacements) {
    output = output.replace(pattern, token);
  }

  return output;
}
