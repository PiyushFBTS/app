// app/AzureToPOS/route.ts
import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer, order } = body
    const details = order.details

    // 1. Insert into Order_Header
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
    const discountItem = order.items.find((item: any) => item.discount_id && item.discount_code);

    const order_discount_id = discountItem?.discount_id ?? '';
    const order_discount_code = discountItem?.discount_code ?? '';
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
      new Date(details.delivery_datetime),
      details.order_state,
      details.instructions,
      details.total_charges,
      new Date(details.created),
      details.order_subtotal,
      details.payable_amount,
      order.store.name,
      order.store.merchant_ref_id,
      order.table_no || '',
      details.ext_platforms?.[0]?.id ?? null,
      order_discount_id,
      order_discount_code,
      details.ext_platforms?.[0]?.extras?.deliver_asap || 0,
      details.ext_platforms?.[0]?.extras?.order_otp,
      customer.id,
      details.expected_pickup_time ? new Date(details.expected_pickup_time) : null
    ];

    await pool.query(orderHeaderQuery, headerValues)

    // 2. Insert into order_line
    async function insertOrderLine({
      item,
      subItem,
      details,
      lineNo,
      parentLineNo = 0,
      indent = 0
    }: {
      item: any,
      subItem: any,
      details: any,
      lineNo: number,
      parentLineNo?: number,
      indent?: number
    }) {
      const orderLineQuery = `
    INSERT INTO "OOMiddleware".order_line (
      order_id, line_no, parent_line_no, item_merchant_id, item_name, item_quantity,
      item_price, item_discount, item_total, item_total_with_tax, 
      items_options_to_add_group_is_variant, item_instructions,
      cgst_rate, cgst_liability_on, cgst_amount, cgst_title,
      sgst_rate, sgst_liability_on, sgst_amount, sgst_title,
      items_redeem_subscription_voucher_code,indent
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, 
      $11, $12,
      $13, $14, $15, $16,
      $17, $18, $19, $20,
      $21,$22
    )
  `;

      const taxes = (subItem.taxes && subItem.taxes.length > 0) ? subItem.taxes : item.taxes || [];
      const cgst = taxes.find((t: any) => t.title === 'CGST') || {};
      const sgst = taxes.find((t: any) => t.title === 'SGST') || {};

      const isMainItem = item === subItem;

      const variant = isMainItem ? '0' : (subItem.group?.is_variant ? '1' : '0');

      let discount = 0;
      if (isMainItem) {
        discount = item.discount || 0;
      } else {
        if (item.merchant_id === "DUMMY") {
          const firstOption = item.options_to_add?.[0];
          discount = (firstOption?.id === subItem.id) ? (item.discount || 0) : 0;
        } else {
          discount = subItem.discount || 0;
        }
      }

      const total = item.options_to_add?.length > 0 ? subItem.price : item.total || 0;
      const totalWithTax = item.options_to_add?.length > 0
        ? (total || 0) + (subItem.total_tax || item.total_tax || 0) : item.total_with_tax || 0;

      const orderLineValues = [
        details.id,
        lineNo,
        parentLineNo,
        subItem.merchant_id,
        subItem.title,
        subItem.quantity,
        subItem.price,
        discount,
        total,
        totalWithTax,
        variant,
        item.instructions || '',
        cgst.liability_on === "aggregator" ? 0 : cgst.rate,
        cgst.liability_on || '',
        cgst.liability_on === "aggregator" ? 0 : cgst.value,
        cgst.title || '',
        sgst.liability_on === "aggregator" ? 0 : sgst.rate,
        sgst.liability_on || '',
        sgst.liability_on === "aggregator" ? 0 : sgst.value,
        sgst.title || '',
        item.discount_code || '',
        indent
      ];

      await pool.query(orderLineQuery, orderLineValues);
    }


    let lineNo = 1;
    const itemIdToLineNo = new Map();

    for (const item of order.items) {
      const isDummyItem = item.merchant_id === "DUMMY";
      let mainItemLineNo = 0;

      if (!isDummyItem) {
        // Insert the actual item as main line
        await insertOrderLine({
          item,
          subItem: item,
          details,
          lineNo,
          parentLineNo: 0,
          indent: 0,
        });
        itemIdToLineNo.set(item.id, lineNo);
        mainItemLineNo = lineNo;
        lineNo++;
      }

      if (item.options_to_add && item.options_to_add?.length > 0) {
        let dummyBaseLineNo = 0;

        for (const [index, subItem] of item.options_to_add.entries()) {
          if (isDummyItem && index === 0) {
            // First option under DUMMY item becomes main line
            await insertOrderLine({
              item,
              subItem,
              details,
              lineNo,
              parentLineNo: 0,
              indent: 0,
            });
            dummyBaseLineNo = lineNo;
            itemIdToLineNo.set(subItem.id, lineNo);
            lineNo++;
          } else {
            // Options under DUMMY's first option or normal item
            const parentLineNo = isDummyItem
              ? dummyBaseLineNo
              : itemIdToLineNo.get(item.id) || 0;
            const indent = 1;

            await insertOrderLine({
              item, subItem, details, lineNo, parentLineNo, indent
            });
            itemIdToLineNo.set(subItem.id, lineNo);
            lineNo++;
          }
        }
      }
    }



    // 3. Insert into order_status

    const session = await getServerSession(authOptions);
    const currentUser = session?.user?.user_name || 'system';
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
      details.instructions,
      details.order_state,
      details.id,
      null,
      order.store.id,
      new Date(details.updated),
      currentUser,
      currentUser,
    ]
    await pool.query(orderStatusQuery, statusValues)

    return NextResponse.json({ message: 'Order inserted successfully' }, { status: 201 })

  } catch (error) {
    console.error('POST /AzureToPOS error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
