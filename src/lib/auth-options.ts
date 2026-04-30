import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { ADMIN_GITHUB_LOGIN } from "@/lib/authz";

const hasGitHubOAuth =
  Boolean(process.env.GITHUB_CLIENT_ID) && Boolean(process.env.GITHUB_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  // Avoid production 500s from missing env config.
  secret: process.env.NEXTAUTH_SECRET ?? "dev-only-fallback-secret-change-me",
  providers: hasGitHubOAuth
    ? [
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
      ]
    : [],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "github") {
        return false;
      }
      const login = (profile as { login?: string } | null)?.login;
      return login === ADMIN_GITHUB_LOGIN;
    },
    async jwt({ token, profile }) {
      if (profile) {
        const login = (profile as { login?: string }).login;
        if (login) {
          token.login = login;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.login && session.user) {
        session.user.name = String(token.login);
      }
      return session;
    },
  },
};
