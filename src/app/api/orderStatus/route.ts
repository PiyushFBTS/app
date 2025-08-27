import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const STATUS_ORDER: Record<string, number> = {
  PLACED: 1,
  ACKNOWLEDGED: 2,
  FOOD_READY: 3,
  COMPLETED: 4,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, ReceiptNo, orderStatus, storeId } = body;

    if (!orderId || !ReceiptNo || !orderStatus || !storeId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1) Check order exists
    const orderCheck = await pool.query(
      'SELECT 1 FROM "OOMiddleware".order_header WHERE order_id = $1',
      [orderId]
    );
    if (orderCheck.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Normalize incoming status
    const incomingStatus = String(orderStatus).toUpperCase();
    if (!(incomingStatus in STATUS_ORDER)) {
      return NextResponse.json({ error: `Invalid incoming status: ${incomingStatus}` }, { status: 400 });
    }
    const incomingNum = STATUS_ORDER[incomingStatus];

    // 2) Get latest status row for this order
    const latestRes = await pool.query(
      'SELECT * FROM "OOMiddleware".order_new_status WHERE order_id = $1 ORDER BY modified_time DESC, order_status_id DESC LIMIT 1',
      [orderId]
    );
    const latest = latestRes.rows[0] ?? null;

    // 3) If latest exists, validate transition
    if (latest) {
      const latestStatus = String(latest.order_status).toUpperCase();
      if (!(latestStatus in STATUS_ORDER)) {
        return NextResponse.json({ error: `Invalid stored latest status: ${latestStatus}` }, { status: 500 });
      }
      const latestNum = STATUS_ORDER[latestStatus];

      // same status -> conflict
      if (latestNum === incomingNum) {
        return NextResponse.json({ error: `Order is already ${latestStatus}` }, { status: 409 });
      }

      // incoming must be exactly next numeric state
      if (incomingNum !== latestNum + 1) {
        return NextResponse.json(
          {
            error: `Invalid status transition from ${latestStatus} -> ${incomingStatus}. Allowed next: ${Object.keys(STATUS_ORDER).find(k => STATUS_ORDER[k] === latestNum + 1)
              ?? "none"}`,
          },
          { status: 400 }
        );
      }
    } else {
      // No latest row: only allow PLACED as the first status
      if (incomingStatus !== "PLACED") {
        return NextResponse.json({ error: `First status must be PLACED. Received: ${incomingStatus}` }, { status: 400 });
      }
    }

    // 4) Detect whether prev_status column exists (so we don't try to insert a non-existent column)
    const colRes = await pool.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_schema = $1 AND table_name = $2 AND column_name = $3`,
      ["OOMiddleware", "order_new_status", "prev_status"]
    );
    const hasPrevStatus = colRes.rows.length > 0;

    // 5) Insert accordingly
    let insertQuery: string;
    let insertValues: any[];

    if (hasPrevStatus) {
      insertQuery = `
        INSERT INTO "OOMiddleware".order_new_status
          (order_id, store_id, receipt_no, order_status, prev_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      insertValues = [orderId, storeId, ReceiptNo, incomingStatus, latest ? latest.order_status : null];
    } else {
      insertQuery = `
        INSERT INTO "OOMiddleware".order_new_status
          (order_id, store_id, receipt_no, order_status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      insertValues = [orderId, storeId, ReceiptNo, incomingStatus];
    }

    const insertRes = await pool.query(insertQuery, insertValues);

    return NextResponse.json(
      { message: "Order status inserted successfully", row: insertRes.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /order-status:", (error as Error).message ?? error);
    return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
  }
}
