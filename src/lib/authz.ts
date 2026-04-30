import type { Session } from "next-auth";

export const ADMIN_GITHUB_LOGIN = "BETTlM";

export function isAdminSession(session: Session | null) {
  const login = session?.user?.name;
  return Boolean(login && login === ADMIN_GITHUB_LOGIN);
}
