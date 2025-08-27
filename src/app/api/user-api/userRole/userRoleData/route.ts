import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    
    const res = await pool.query('SELECT * FROM  "OOMiddleware".user_role ORDER BY role_code ASC');

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching UserRole:', error);
    return NextResponse.json({ error: 'Failed to fetch UserRole' }, { status: 500 });
  }
}
