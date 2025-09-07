// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Use JWT sessions so we don’t need a database right now
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // Add Email or others later once we add an adapter/db.
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // persist provider data on first sign in
      if (account?.provider === "google") {
        token.provider = "google";
      }
      if (profile && typeof profile.sub === "string") {
        token.sub = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // attach id from token
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },

  // Optional: friendly pages if you want custom screens later
  pages: {
    // signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error",
  },
};