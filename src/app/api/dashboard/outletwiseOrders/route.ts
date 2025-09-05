import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const OrderQuery = `SELECT col1, col2, col3 FROM "OOMiddleware".outletwise_no_of_orders();`;
    const { rows } = await pool.query(OrderQuery);

    return NextResponse.json(rows);
}
