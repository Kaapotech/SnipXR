import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "placeholder",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "placeholder",
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) return null;

        return user as any;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token }: any) => {
      if (token.sub) {
        const user = await db.user.findUnique({
          where: { id: token.sub },
          select: { plan: true },
        });
        token.plan = user?.plan ?? "free";
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.sub;
        session.user.plan = token.plan ?? "free";
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
