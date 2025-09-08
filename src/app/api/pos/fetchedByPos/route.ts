import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: NextRequest) {
    try {

        const body = await request.json()
        if (!pool) {
            return NextResponse.json({ error: "Database connection not available" }, { status: 500 })
        }

        const { order_id } = body
        
        if (!Array.isArray(order_id) || order_id.length === 0) {
            return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
        }

        const currentTime = new Date();
        const processed ='Y'
        const query = `
            UPDATE "OOMiddleware".order_header SET
            processed_at_pos = $1,
            processed_at_pos_time =$2
            WHERE order_id = ANY($3::bigint[])
          `;

        const values = [
             processed,currentTime, order_id
        ]

        await pool.query(query, values)

        return NextResponse.json({ message: "processed at pos successfully" }, { status: 200 })


    } catch (error) {
        console.error("Error in POST:", error);
        return NextResponse.json(
            { error: "Failed to fethc ay POS" },
            { status: 500 }
        );
    }
}
