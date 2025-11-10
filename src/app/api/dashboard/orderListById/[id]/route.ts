import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(  request: Request,  { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid or missing order ID" },
        { status: 400 }
      );
    }

    const query = `SELECT "OOMiddleware".get_order_by_id_as_json($1);`;
    const { rows } = await pool.query(query, [id]);

    const data = rows[0]?.get_order_by_id_as_json || null;

    if (!data) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching order by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
