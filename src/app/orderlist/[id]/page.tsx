"use client";

import { useEffect, useState, FC } from "react";
import {
  ArrowLeft,
  Package,
  User,
  CreditCard,
  Monitor,
  Plug,
  ShoppingCart,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { OrderType } from "@/types/orderDeatilList.type";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface InfoCardProps {
  icon: FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  fields: { key: keyof OrderType; label: string; format?: "datetime" | "boolean" }[];
  order: OrderType;
}

const InfoCard: FC<InfoCardProps> = ({ icon: Icon, title, fields, order }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map(({ key, label, format }) => {
        const value = order[key];
        if (value === null || value === undefined || value === "") return null;

        let displayValue: string = String(value);

        if (format === "datetime") {
          displayValue = new Date(value as string).toLocaleString("en-IN");
        }

        if (format === "boolean") {
          displayValue = value === "Y" ? "Yes" : "No";
        }

        return (
          <div key={String(key)}>
            <p className="text-xs text-gray-500 uppercase">{label}</p>
            <p className="text-base font-semibold text-gray-900">{displayValue}</p>
          </div>
        );
      })}
    </div>
  </div>
);

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL

        setIsLoading(true);
        const response = await axios.get(`${url}/api/dashboard/getOrderById/${id}`);
        console.log("orderby-id->url", `${url}/api/dashboard/getOrderById/${id}`);

        let data = response.data;
        if (Array.isArray(data)) data = data[0];
        setOrder(data as OrderType);
      } catch (error) {
        console.error("Error fetching Order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Order details not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff]">
      <div className="w-full px-2 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Button
            onClick={() => router.back()}
            className="flex cursor-pointer items-center gap-2 hover:bg-gray-300 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
        </div>

        {/* Accordion Wrapper */}
        <Accordion type="single" collapsible className="space-y-4 mb-8">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-700" /> General Information
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <InfoCard
                icon={Package}
                title="General Information"
                order={order}
                fields={[
                  { key: "order_id", label: "Order Id" },
                  { key: "order_type", label: "Order Type" },
                  { key: "channel", label: "Channel" },
                  { key: "date_created", label: "Created At", format: "datetime" },
                  { key: "del_datetime", label: "Delivery Time", format: "datetime" },
                  { key: "store_id", label: "Store ID" },
                  { key: "store_name", label: "Store Name" },
                  { key: "status", label: "Status" },
                ]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-700" /> Customer Information
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <InfoCard
                icon={User}
                title="Customer Information"
                order={order}
                fields={[
                  { key: "customer_name", label: "Name" },
                  { key: "customer_phone", label: "Phone" },
                  { key: "customer_email", label: "Email" },
                  { key: "app_uid", label: "App UID" },
                ]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-700" /> Payment Summary
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <InfoCard
                icon={CreditCard}
                title="Payment Summary"
                order={order}
                fields={[
                  { key: "order_total", label: "Subtotal" },
                  { key: "order_tot_tax", label: "Tax" },
                  { key: "discount", label: "Discount" },
                  { key: "tot_charges", label: "Charges" },
                  { key: "order_payable_amt", label: "Total Payable" },
                ]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-gray-700" /> POS Information
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <InfoCard
                icon={Monitor}
                title="POS Information"
                order={order}
                fields={[
                  { key: "fetched_at_pos", label: "Fetched", format: "boolean" },
                  { key: "processed_at_pos", label: "Processed", format: "boolean" },
                  { key: "fetched_by_pos_time", label: "Fetched Time", format: "datetime" },
                  { key: "pos_processed_time", label: "Processed Time", format: "datetime" },
                  { key: "exp_pickup_time", label: "Pickup Time", format: "datetime" },
                ]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Plug className="w-5 h-5 text-gray-700" /> Integration Details
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <InfoCard
                icon={Plug}
                title="Integration Details"
                order={order}
                fields={[
                  { key: "ext_platform_id", label: "Platform ID" },
                  { key: "landed", label: "Landed At", format: "datetime" },
                ]}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ---------------- ORDER ITEMS TABLE ---------------- */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-gray-50">
            <div className="p-2 bg-gray-900 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold">Order Items</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "#",
                    "Item Merchant Id",
                    "Item",
                    "Qty",
                    "Price",
                    "Discount",
                    "CGST Rate",
                    "CGST Amount",
                    "SGST Rate",
                    "SGST Amount",
                    "Total",
                    "Indent",
                    "Line No",
                    "Parent Line",
                    "Variant",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 text-center">{item.item_merchant_id}</td>
                    <td className="px-6 py-4">{item.item_name}</td>
                    <td className="px-6 py-4 text-center">{item.item_quantity}</td>
                    <td className="px-6 py-4 text-right">₹{item.item_price}</td>
                    <td className="px-6 py-4 text-right text-red-600">
                      {item.item_discount > 0 ? `-₹${item.item_discount.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.cgst_rate > 0 ? item.cgst_rate + "%" : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.cgst_amount > 0 ? `₹${item.cgst_amount.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.sgst_rate > 0 ? item.sgst_rate + "%" : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.sgst_amount > 0 ? `₹${item.sgst_amount.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-bold">
                      ₹{item.item_total_with_tax > 0 ? item.item_total_with_tax : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">{item.indent}</td>
                    <td className="px-6 py-4 text-center">{item.line_no}</td>
                    <td className="px-6 py-4 text-center">
                      {item.parent_line_no === null ? "-" : item.parent_line_no}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.items_options_to_add_group_is_variant}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
