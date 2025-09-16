import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(request: NextRequest) {
    try {

        const body = await request.json();
        if (!pool) {
            return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
        }

        const { order_id } = body;

        if (!Array.isArray(order_id) || order_id.length === 0) {
            return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
        }

        // 🔎 Step 1: Check if all IDs exist
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

        // 🔎 Step 2: Check if all are fetched
        const notFetchedQuery = `
            SELECT order_id 
            FROM "OOMiddleware".order_header
            WHERE order_id = ANY($1::bigint[])
            AND (fetched_by_pos IS DISTINCT FROM 'Y')`;
        const notFetchedResult = await pool.query(notFetchedQuery, [order_id]);

        if (notFetchedResult.rows.length > 0) {
            return NextResponse.json(
                {
                    error: "Some orders have not been fetched yet. Please fetch before processing.",
                    notFetchedOrders: notFetchedResult.rows.map(r => r.order_id),
                },
                { status: 400 }
            );
        }

        // 🔎 Step 3: Check if already processed
        const alreadyProcessedQuery = `
            SELECT order_id 
            FROM "OOMiddleware".order_header
            WHERE order_id = ANY($1::bigint[])
            AND processed_at_pos = 'Y'`;
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

        // ✅ Step 4: Update since all checks passed
        const currentTime = new Date();
        const processed = "Y";
        const updateQuery = `
            UPDATE "OOMiddleware".order_header
            SET processed_at_pos = $1,
                processed_at_pos_time = $2
            WHERE order_id = ANY($3::bigint[]) `;
        const values = [processed, currentTime, order_id];
        await pool.query(updateQuery, values);

        return NextResponse.json(
            { message: "Processed at POS successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in PUT:", error);
        return NextResponse.json(
            { error: "Failed to Process at POS" },
            { status: 500 }
        );
    }
}
