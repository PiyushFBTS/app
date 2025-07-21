import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export async function PUT(req: Request) {
  try {
    if (!pool) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 })
    }


    const session = await getServerSession(authOptions)
    const currentUser = session?.user.username || 'system'
    const currentTime = new Date()

    const body = await req.json()
    const { user_code, role_code, role_name, user_name, user_full_name, user_mobile, user_email, cmp_code, cmp_name, blocked } = body

    const query = `
      UPDATE posdb.users SET
        role_code = $1,
        role_name = $2,
        user_name = $3,
        user_full_name = $4,
        user_mobile = $5,
        user_email = $6,
        cmp_code = $7,
        cmp_name = $8,
        blocked = $9,
        blocked_by = $10,
        blocked_on = $11,
        modified_by = $12,
        modified_on = $13
      WHERE user_code = $14
    `

    const values = [
      role_code,
      role_name,
      user_name,
      user_full_name,
      user_mobile,
      user_email,
      cmp_code,
      cmp_name,
      blocked,
      currentUser,
      currentTime,
      currentUser,
      currentTime,
      user_code,
    ]
    const result = await pool.query(query, values)

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("API Error (User Update):", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
