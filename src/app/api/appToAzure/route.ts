import { NextResponse } from 'next/server'
import pool from '@/lib/db'

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
      details.delivery_datetime ? new Date(details.delivery_datetime) : null,
      details.order_state,
      details.instructions,
      details.total_charges,
      new Date(details.created),
      details.order_subtotal,
      details.payable_amount,
      order.store.name,
      order.store.merchant_ref_id,
      details.tableNo ?? '',
      details.ext_platforms?.[0]?.id ?? null,
      details.discount_id,
      details.discount_code,
      false,
      null,
      customer.app_user_id,
      new Date(details.expected_pickup_time)
    ]

    await pool.query(orderHeaderQuery, headerValues)

    // Insert into order_line
    let lineNo = 1
    for (const item of order.items) {
      const orderLineQuery = `
        INSERT INTO "OOMiddleware".order_line (
          order_id, line_no, parent_line_no, item_merchant_id, item_name, item_quantity,
          item_price, item_discount, item_total, item_total_with_tax,
          items_options_to_add_group_is_variant, item_instructions,
          cgst_rate, cgst_liability_on, cgst_amount, cgst_title,
          sgst_rate, sgst_liability_on, sgst_amount, sgst_title,
          items_redeem_subscription_voucher_code
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12,
          $13, $14, $15, $16,
          $17, $18, $19, $20,
          $21
        )
      `
      const taxes = item.taxes || []
      const cgst = taxes.find((t:any) => t.title === 'CGST') || {}
      const sgst = taxes.find((t:any) => t.title === 'SGST') || {}

      const orderLineValues = [
        details.id,
        lineNo,
        0,
        item.merchant_id,
        item.title,
        item.quantity,
        item.price,
        item.discount,
        item.total,
        item.total_with_tax,
        '0',
        item.instructions,
        cgst.rate || 0,
        cgst.liability_on || '',
        cgst.value || 0,
        cgst.title || '',
        sgst.rate || 0,
        sgst.liability_on || '',
        sgst.value || 0,
        sgst.title || '',
        item.discount_code || ''
      ]
      await pool.query(orderLineQuery, orderLineValues)
      lineNo++
    }

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
      '',
      details.id,
      '',
      details.order_state,
      details.id,
      null,
      order.store.id.toString(),
      new Date(details.created),
      'ConsumerApp',
      'ConsumerApp'
    ]
    await pool.query(orderStatusQuery, statusValues)

    return NextResponse.json({ message: 'Order inserted successfully' }, { status: 201 })
  } catch (error) {
    console.error('POST /api/insertOrder error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}