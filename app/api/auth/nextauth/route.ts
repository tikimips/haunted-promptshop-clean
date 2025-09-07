import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";

export const { handlers: { GET, POST }, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    })
  ],
  session: { strategy: "jwt" }
});