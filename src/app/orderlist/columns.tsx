"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { OrderDeatilList } from "@/types/orderDeatilList.type";

const formatCurrency = (amount: number) =>
  `₹ ${amount}`;

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const columns: ColumnDef<OrderDeatilList>[] = [

  {
    accessorKey: "order_id",
    header: () => <div className="text-left">Order ID</div>,
    cell: ({ row }) => <div className="text-left pl-4 font-semibold">{row.original.order_id}</div>,
  },
  {
    accessorKey: "store_id",
    header: () => <div className="text-left">Store ID</div>,
    cell: ({ row }) => <div className="text-left pl-4">{row.original.store_id}</div>,
  },
  {
    accessorKey: "order_type",
    header: () => <div className="text-left">Order Type</div>,
    cell: ({ row }) => <div className="text-left pl-4">{row.original.order_type}</div>,
  },
  {
    accessorKey: "store_name",
    header: () => <div className="text-left">Store Name</div>,
    cell: ({ row }) => (
      <div className="text-left pl-4">
        {row.original.store_name?.length > 25
          ? `${row.original.store_name.slice(0, 25)}...`
          : row.original.store_name}
      </div>
    ),
  },
  {
    accessorKey: "order_total",
    header: () => <div className="text-left">Order Total</div>,
    cell: ({ row }) => (
      <div className="text-left pl-4 font-medium">
        {formatCurrency(row.original.order_total)}
      </div>
    ),
  },
  {
    accessorKey: "tot_charges",
    header: () => <div className="text-left">Total Charges</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatCurrency(row.original.tot_charges)}</div>,
  },
  {
    accessorKey: "date_created",
    header: () => <div className="text-left">Date Created</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatDate(row.original.date_created)}</div>,
  },
  {
    accessorKey: "del_datetime",
    header: () => <div className="text-left">Delivery Date</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatDate(row.original.del_datetime)}</div>,
  },
  {
    accessorKey: "customer_name",
    header: () => <div className="text-left">Customer</div>,
    cell: ({ row }) => <div className="text-left pl-4">{row.original.customer_name}</div>,
  },
  {
    accessorKey: "order_tot_tax",
    header: () => <div className="text-left">Tax</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatCurrency(row.original.order_tot_tax)}</div>,
  },
  {
    accessorKey: "customer_email",
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => (
      <div className="text-left pl-4">
        {row.original.customer_email?.length > 30
          ? `${row.original.customer_email.slice(0, 30)}...`
          : row.original.customer_email}
      </div>
    ),
  },
  {
    accessorKey: "customer_phone",
    header: () => <div className="text-left">Phone</div>,
    cell: ({ row }) => <div className="text-left pl-4">{row.original.customer_phone}</div>,
  },
    {
    accessorKey: "landed",
    header: () => <div className="text-left">Landed</div>,
    cell: ({ row }) => <div className="text-left pl-4">{row.original.landed}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 text-xs rounded-md font-medium ${
          row.original.status === "Completed"
            ? "bg-green-100 text-green-800"
            : row.original.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "app_uid",
    header: () => <div className="text-left">App UID</div>,
    cell: ({ row }) => <div className="text-left pl-4">{row.original.app_uid}</div>,
  },
  {
    accessorKey: "channel",
    header: () => <div className="text-left">Channel</div>,
    cell: ({ row }) => <div className="text-left pl-4">{row.original.channel}</div>,
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Discount <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-left pl-4">{formatCurrency(row.original.discount)}</div>,
  },
  {
    accessorKey: "fetched_at_pos",
    header: () => <div className="text-left">Fetched At POS</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatDate(row.original.fetched_at_pos)}</div>,
  },
  {
    accessorKey: "exp_pickup_time",
    header: () => <div className="text-left">Expected Pickup</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatDate(row.original.exp_pickup_time)}</div>,
  },
  {
    accessorKey: "ext_platform_id",
    header: () => <div className="text-left">Platform ID</div>,
    cell: ({ row }) => <div className="text-left pl-4">{row.original.ext_platform_id}</div>,
  },
  {
    accessorKey: "processed_at_pos",
    header: () => <div className="text-left">Processed At POS</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatDate(row.original.processed_at_pos)}</div>,
  },
  {
    accessorKey: "order_payable_amt",
    header: () => <div className="text-left">Payable Amount</div>,
    cell: ({ row }) => (
      <div className="text-left pl-4 font-semibold">
        {formatCurrency(row.original.order_payable_amt)}
      </div>
    ),
  },
  {
    accessorKey: "pos_processed_time",
    header: () => <div className="text-left">POS Processed</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatDate(row.original.pos_processed_time)}</div>,
  },
  {
    accessorKey: "fetched_by_pos_time",
    header: () => <div className="text-left">Fetched By POS</div>,
    cell: ({ row }) => <div className="text-left pl-4">{formatDate(row.original.fetched_by_pos_time)}</div>,
  },
];
