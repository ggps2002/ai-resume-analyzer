

import NextAuth, { User } from "next-auth";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { signUp } from "./lib/actions/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) return null;

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password,
        );

        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
        } as User;
      },
    }),
   Google, Github],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "github") {
          const name = user.name ?? "";
          const email = user.email ?? "";
          const password = "github"; // Default password for Google sign-in
  
          // Save user to database (prevent duplicate entries)
          await signUp({ fullName: name, email, password });
        }
        
        if (account?.provider === "google") {
          const name = user.name ?? "";
          const email = user.email ?? "";
          const password = "google"; // Default password for Google sign-in
  
          // Save user to database (prevent duplicate entries)
          await signUp({ fullName: name, email, password });
        }
  
        return true; // Allow sign-in
      } catch (error) {
        console.error("Error saving user:", error);
        return false; // Reject sign-in if there's an error
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
});
