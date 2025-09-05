import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const OrderQuery = `SELECT "OOMiddleware".get_order_list_as_json();`;
    const { rows } = await pool.query(OrderQuery);

    return NextResponse.json(rows);
}
