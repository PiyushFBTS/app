import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: NextRequest) {
    try {

        const body = await request.json()
        if (!pool) {
            return NextResponse.json({ error: "Database connection not available" }, { status: 500 })
        }

        const { order_id } = body;

        if (!Array.isArray(order_id) || order_id.length === 0) {
            return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
        }

        // 🔎 Step 1: Check if  Order don't exist

        const existingQuery = `
                SELECT order_id 
                FROM "OOMiddleware".order_header
                WHERE order_id = ANY($1::bigint[])`;

        const existingResult = await pool.query(existingQuery, [order_id]);
        const existingIds = existingResult.rows.map(r => r.order_id);

        const notFoundIds = order_id.filter(id => !existingIds.includes(id));
        if (notFoundIds.length > 0) {
            return NextResponse.json(
                {
                    error: "Some order IDs were not found",
                    notFoundOrders: notFoundIds,
                },
                { status: 404 }
            );
        }

        // 🔎 Step 2: Check if already Fetched
        const alreadyProcessedQuery = `
                SELECT order_id 
                FROM "OOMiddleware".order_header
                WHERE order_id = ANY($1::bigint[])
                AND fetched_by_pos = 'Y' `;

        const alreadyProcessedResult = await pool.query(alreadyProcessedQuery, [order_id]);

        if (alreadyProcessedResult.rows.length > 0) {
            return NextResponse.json(
                {
                    error: "Some orders are already processed at POS",
                    alreadyProcessedOrders: alreadyProcessedResult.rows.map(r => r.order_id),
                },
                { status: 400 }
            );
        }

        // 🔎 Step 3: update the table

        const currentTime = new Date();
        const processed = "Y";

        const query = `
                UPDATE "OOMiddleware".order_header
                SET fetched_by_pos = $1,
                    "fetched_by_pos_Time" = $2
                WHERE order_id = ANY($3::bigint[]) `;

        const values = [processed, currentTime, order_id];

        await pool.query(query, values);

        return NextResponse.json(
            { message: "Fetched at POS successfully" },
            { status: 200 }
        );


    } catch (error) {
        console.error("Error in fetched by pos:", error);
        return NextResponse.json(
            { error: "Fail to Fetched At POS" },
            { status: 500 }
        );
    }
}
