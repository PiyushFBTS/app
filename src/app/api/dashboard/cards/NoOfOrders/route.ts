import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const OrderQuery = `SELECT col1, col2 FROM "OOMiddleware".No_of_Orders();`;
    const { rows } = await pool.query(OrderQuery);

    return NextResponse.json(rows);
}
