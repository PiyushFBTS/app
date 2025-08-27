import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request,{ params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params)?.id
    const result = await pool.query('SELECT * FROM "OOMiddleware"."users" WHERE user_code = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const ou = result.rows[0];


    return NextResponse.json(ou);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
