import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
    user_code: string;
    user_name: string;
    first_name: string;
    last_name: string;
    role: string;
    } & DefaultSession["user"]
  }

  interface User {
    user_code: string;
    user_name: string;
    first_name: string;
    last_name: string;
    role: string;
  }
}

// Extend JWT token types
declare module "next-auth/jwt" {
  interface JWT {
    user_code: string;
    user_name: string;
    first_name: string;
    last_name: string;
    role: string;
  }
}
