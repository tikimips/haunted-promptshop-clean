import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// (optional) keep on Node runtime for provider SDKs
export const runtime = "nodejs";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  );
}

const handler = NextAuth({
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token?.email && session.user) session.user.email = token.email as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// App Router requires exporting HTTP methods only
export { handler as GET, handler as POST };