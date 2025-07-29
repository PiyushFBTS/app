import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { toPostgresDateTime } from '@/lib/date';

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer, order } = body
    const details = order.details

    // Insert into Order_Header
    const orderHeaderQuery = `
      INSERT INTO "OOMiddleware"."Order_Header" (
        order_id, order_channel, customer_phone, customer_email, customer_name,
        order_total_tax, order_payable_amount, order_total, order_type, order_discount,
        order_delivery_datetime, order_status, order_instructions, order_total_charges,
        order_created, order_subtotal, order_payment_amount, order_store, 
        order_store_merchant_ref_id, order_table_no, created_date_time,
        order_ext_platform_id, order_discount_id, order_discount_code,
        order_is_instant_order, order_otp, customer_app_uid,
        order_expected_pickup_time
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18,
        $19, $20, NOW(),
        $21, $22, $23,
        $24, $25, $26,
        $27
      )
    `

    const headerValues = [
      details.id,
      details.channel,
      customer.phone,
      customer.email,
      customer.name,
      details.total_taxes,
      details.payable_amount,
      details.order_total,
      details.order_type,
      details.discount,
      details.delivery_datetime ? toPostgresDateTime(details.delivery_datetime) : null,
      details.order_state,
      details.instructions || "",
      details.total_charges,
      toPostgresDateTime(details.created),
      details.order_subtotal,
      details.payable_amount,
      order.store.name,
      order.store.merchant_ref_id,
      details.tableNo ?? '',
      details.ext_platforms?.[0]?.id ?? null,
      details.discount_id,
      details.discount_code,
      details.ext_platforms?.[0]?.extras?.deliver_asap || false,
      details.ext_platforms?.[0]?.extras?.order_otp || "",
      customer.app_user_id,
      toPostgresDateTime(details.expected_pickup_time)
    ]

    await pool.query(orderHeaderQuery, headerValues)

    // Insert into order_line
    let lineNo = 1;
    const itemIdToLineNo = new Map();

    for (const item of order.items) {
      const isDummyItem = item.merchant_id === "DUMMY";
      let dummyBaseLineNo = 0;

      if (!isDummyItem) {
        // Non-dummy item — insert main item line

        const orderLineQuery = `
        INSERT INTO "OOMiddleware".order_line (
          order_id, line_no, parent_line_no, item_merchant_id, item_name, item_quantity,
          item_price, item_discount, item_total, item_total_with_tax,
          items_options_to_add_group_is_variant, item_instructions,
          cgst_rate, cgst_liability_on, cgst_amount, cgst_title,
          sgst_rate, sgst_liability_on, sgst_amount, sgst_title,
          items_redeem_subscription_voucher_code, indent,item_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12,
          $13, $14, $15, $16,
          $17, $18, $19, $20,
          $21, $22, $23
        )
      `
        const cgst = item.taxes?.find((t: any) => t.title === 'CGST') || {};
        const sgst = item.taxes?.find((t: any) => t.title === 'SGST') || {};
        const TotalWIthTax = item.total + cgst.value + sgst.value || 0

        const orderLineValues = [
          details.id,
          lineNo,
          0, // parent_line_no
          item.merchant_id,
          item.title || 'Untitled Item',
          item.quantity || 1,
          item.price || 0,
          item.discount || 0,
          item.total || 0,
          TotalWIthTax || 0,
          '0', // is_variant
          item.instructions || '',
          cgst.rate || 0,
          cgst.liability_on || '',
          cgst.value || 0,
          cgst.title || '',
          sgst.rate || 0,
          sgst.liability_on || '',
          sgst.value || 0,
          sgst.title || '',
          item.discount_code || '',
          0, // indent
          item.id
        ];

        await pool.query(orderLineQuery, orderLineValues);
        itemIdToLineNo.set(item.id, lineNo);
        lineNo++;
      }

      // Handle options_to_add (sub items)
      for (const [index, option] of (item.options_to_add || []).entries()) {
        const cgst = option.taxes?.find((t: any) => t.title === 'CGST') || {};
        const sgst = option.taxes?.find((t: any) => t.title === 'SGST') || {};

        const isFirstUnderDummy = isDummyItem && index === 0;
        const parentLineNo = isFirstUnderDummy ? 0 : isDummyItem ? dummyBaseLineNo : itemIdToLineNo.get(item.id) || 0;

        const indent = isFirstUnderDummy ? 0 : 1;

        const orderLineQuery = `
      INSERT INTO "OOMiddleware".order_line (
        order_id, line_no, parent_line_no, item_merchant_id, item_name, item_quantity,
        item_price, item_discount, item_total, item_total_with_tax,
        items_options_to_add_group_is_variant, item_instructions,
        cgst_rate, cgst_liability_on, cgst_amount, cgst_title,
        sgst_rate, sgst_liability_on, sgst_amount, sgst_title,
        items_redeem_subscription_voucher_code, indent,item_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, $20,
        $21, $22, $23
      )
    `;

        const orderLineValues = [
          details.id,
          lineNo,
          parentLineNo,
          option.merchant_id || item.merchant_id,
          option.title || 'Untitled Option',
          option.quantity || 1,
          option.price || 0,
          option.discount || 0,
          option.total_price || 0,
          option.total_price + option.total_tax || 0,
          option.group?.is_variant ? '1' : '0',
          option.instructions || '',
          cgst.rate || 0,
          cgst.liability_on || '',
          cgst.value || 0,
          cgst.title || '',
          sgst.rate || 0,
          sgst.liability_on || '',
          sgst.value || 0,
          sgst.title || '',
          option.voucher_code || '',
          indent,
          item.id
        ];

        await pool.query(orderLineQuery, orderLineValues);

        if (isFirstUnderDummy) {
          dummyBaseLineNo = lineNo;
          itemIdToLineNo.set(option.id, lineNo);
        }
        lineNo++;
      }
    }
    const session = await getServerSession(authOptions);
    const currentUser = session?.user?.user_name || 'system';

    // Insert into order_status
    const orderStatusQuery = `
      INSERT INTO "OOMiddleware".order_status (
        additional_info_name, additional_info_order_id, message, new_state,
        order_id, prev_state, store_id, "timestamp", "Updated_by", "Updated_By_User", created_date_time
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9, $10, NOW()
      )
    `
    const statusValues = [
      details.dash_extra_info || "",
      details.id,
      details.instructions || "",
      details.order_state,
      details.id,
      null,
      order.store.id.toString(),
      toPostgresDateTime(details.created),
      currentUser,
      currentUser
    ]
    await pool.query(orderStatusQuery, statusValues)

    return NextResponse.json({ message: 'Order inserted successfully' }, { status: 201 })
  } catch (error) {
    console.error('POST /api/insertOrder error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}