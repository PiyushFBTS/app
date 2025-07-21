// lib/getServerSession.ts
import { getServerSession as getNextAuthSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const getServerSession = () => getNextAuthSession(authOptions)
