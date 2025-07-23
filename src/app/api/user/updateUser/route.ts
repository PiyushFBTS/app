import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function PUT(req: Request) {
  try {
    if (!pool) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 })
    }

    const body = await req.json()
    const { role_code, user_code, user_name, first_name, last_name } = body

    const query = `
      UPDATE "OOMiddleware"."Users" SET
        role_code = $1,
        user_name = $2,
        first_name = $3,
        last_name = $4
      WHERE user_code = $5
    `

    const values = [
      role_code,
      user_name,
      first_name,
      last_name,
      user_code
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
