import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { ADMIN_GITHUB_LOGIN } from "@/lib/authz";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "placeholder-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "placeholder-client-secret",
    }),
  ],
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
