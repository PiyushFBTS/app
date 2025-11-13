import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params)?.id

    // Call the correct function
    const result = await pool.query(
      `SELECT "OOMiddleware".get_order_by_id_as_json($1) AS data`,
      [id]
    );

    const row = result.rows[0]?.data;

    if (!row) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(row);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to fetch order details",
        error: error.message,
        status: "fail",
        timestamp: new Date().toLocaleString("en-IN"),
      },
      { status: 500 }
    );
  }
}
