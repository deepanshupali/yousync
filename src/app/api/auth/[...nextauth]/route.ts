import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

type AppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
};

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID!;
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET!;

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        const result = await prisma.user.deleteMany({
          where: {
            provider: "guest",
            expiresAt: { lt: new Date() },
          },
        });

        console.log(`🧹 Deleted ${result.count} expired guest users`);

        const guestUser = await prisma.user.create({
          data: {
            name: `Guest-${Math.floor(Math.random() * 10000)}`,
            provider: "guest",
            expiresAt: new Date(Date.now() + 45 * 60 * 1000), // expires in 45 min
          },
        });
        console.log("Created guest user:", guestUser);
        return {
          id: guestUser.id,
          name: guestUser.name,
          provider: "guest",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 45, // 45 minutes
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/watchparty`; // 👈 Always redirect to watchparty
    },
    async signIn({ user }) {
      if (!user?.id) return true; // guest ya google user

      // cleanup expired memberships for this user
      const memberships = await prisma.membership.findMany({
        where: { userId: user.id },
      });
      console.log("User memberships:", memberships);
      const now = Date.now();
      for (const m of memberships) {
        const joinedAt = m.joinedAt.getTime();
        if (now - joinedAt > 45 * 60 * 1000) {
          await prisma.membership.delete({ where: { id: m.id } });
        }
      }

      return true; // allow sign in
    },
    async jwt({ token, user }) {
      if (user) {
        const { id, provider } = user as AppUser;
        token.id = id;
        token.provider = provider ?? "google";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string; // ✅ put id back into session
      session.user.provider = token.provider as string;
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { authOptions };

// just like we write get and post in route.ts files
// handler handles both get and post requests
export { handler as GET, handler as POST };
