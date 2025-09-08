import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth (required envs: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    // Optional email magic-link (only enabled if both envs exist)
    ...(process.env.EMAIL_SERVER && process.env.EMAIL_FROM
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  // use default NextAuth pages (includes /api/auth/signin)
};

const handler = NextAuth(authOptions);

// App Router requires exporting HTTP methods:
export { handler as GET, handler as POST };