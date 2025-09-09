import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const OrderQuery = `SELECT * FROM "OOMiddleware".Todays_top_10_amt();`;
   
    const { rows } = await pool.query(OrderQuery);

    return NextResponse.json(rows);
}

