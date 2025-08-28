import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeid: merchantRefId } = body;

    // Use parameterized query safely
    const headerQuery = `SELECT "OOMiddleware".get_orders_f($1) AS orders`;
    const { rows } = await pool.query(headerQuery, [merchantRefId]);
    
    // rows[0].orders will contain the jsonb result from the function
    const orders = rows[0]?.orders || { Order: [] };

    return NextResponse.json(orders, { status: 200 });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
