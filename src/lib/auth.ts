import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

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
        // Aceasta este o implementare de test. In productie trebuie sa verificam parola hashed.
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (user) {
          return user as any;
        }
        
        // Daca nu exista, il cream (doar pentru acest demo rapid)
        const newUser = await db.user.create({
          data: {
            email: credentials.email,
            name: credentials.email.split('@')[0],
          }
        });

        return newUser as any;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
