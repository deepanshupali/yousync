import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID!;
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET!;

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/watchparty`; // 👈 Always redirect to watchparty
    },
    async signIn({ profile }) {
      console.log("Profile:", profile);
      return true;
    },
  },
};
const handler = NextAuth(authOptions);
export { authOptions };

// just like we write get and post in route.ts files
// handler handles both get and post requests
export { handler as GET, handler as POST };
