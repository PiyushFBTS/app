// /app/api/user/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role_code, role_name, role_description, created_by, created_on, modified_by, modified_on } = body;

    // const session = await getServerSession(authOptions);
    // const currentUser = session?.user?.user_name || 'system';
    // const currentTime = new Date();
    // const session = await getServerSession(authOptions);
    const currentUser = 'system';
    const currentTime = new Date();

    const query = `
      INSERT INTO "OOMiddleware"."User_Role"(
 role_code, role_name, role_description, created_by, created_on, modified_by, modified_on
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7 )
      RETURNING role_code;
    `;

    const values = [
      role_code, role_name, role_description, created_by, currentTime, modified_by, currentTime
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
