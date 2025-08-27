// /app/api/user/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role_code, user_code, user_name, password, first_name, last_name } = body;

    const session = await getServerSession(authOptions);
    const currentUser = session?.user?.user_name || 'system';
    const currentTime = new Date();

    const query = `
      INSERT INTO "OOMiddleware"."users"(
        role_code, user_code, user_name, password, first_name, last_name,
        created_by_user, created_on_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING user_code;
    `;

    const values = [
      role_code, user_code, user_name, password, first_name, last_name,
      currentUser, currentTime,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ user_code: result.rows[0].user_code }, { status: 201 });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      { message: "Failed to create user", error: err.message, status: "fail" },
      { status: 500 }
    );
  }
}
