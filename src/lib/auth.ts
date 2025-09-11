// lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import pool from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        try {
          const res = await pool.query(
            `SELECT * FROM "OOMiddleware"."users" WHERE user_name = $1`,
            [credentials.username]
          )

          const user = res.rows[0]
          
          

          if (!user) throw new Error("No user found with this username")

          // ✅ Compare hashed password with bcrypt
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            throw new Error("Invalid password")
          }

          // Return user data for JWT and session
          return {
            id: user.user_code,
            user_code: user.user_code,
            user_name: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
          }
        } catch (err) {
          console.error("Login failed:", err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_code = user.user_code
        token.user_name = user.user_name
        token.first_name = user.first_name
        token.last_name = user.last_name
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.user_code = token.user_code
        session.user.user_name = token.user_name
        session.user.first_name = token.first_name
        session.user.last_name = token.last_name
        session.user.role = token.role
      }
      return session
    },
  },
}
