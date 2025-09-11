// src/middleware.ts
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Allow unauthenticated access only to:
  const isAuthRoute = pathname.startsWith("/auth/login")
  const isApiRoute = pathname.startsWith("/api")
  const isStaticFile = pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || pathname.startsWith("/assets")

  if (!token && !isAuthRoute && !isApiRoute && !isStaticFile && pathname !== "/") {
    // Redirect to login if no session
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Apply to all routes, except static files
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
}
