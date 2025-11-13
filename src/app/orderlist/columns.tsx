"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Package, Store, User, Calendar, CreditCard, Phone, Mail, MapPin, Truck, Clock, CheckCircle, XCircle, AlertCircle, DollarSign } from "lucide-react";
import { OrderDeatilList } from "@/types/orderDeatilList.type";
import Link from "next/link";

const formatCurrency = (amount: number) =>
  `₹ ${amount?.toLocaleString() || 0}`;

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })} ${date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};
const formatDateISO = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short", // "long" → September, "short" → Sep, "2-digit" → 09
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // AM/PM format
  });
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    "Completed": {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: CheckCircle
    },
    "Pending": {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: Clock
    },
    "Processing": {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: AlertCircle
    },
    "Cancelled": {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      icon: XCircle
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Pending"];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
};

const getOrderTypeBadge = (orderType: string) => {

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md `}>
      {orderType}
    </span>
  );
};

export const columns: ColumnDef<OrderDeatilList>[] = [
  {
    accessorKey: "order_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold text-left hover:bg-transparent"
      >
        <Package className="h-4 w-4 mr-2 text-blue-600" />
        Order ID
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.original.order_id;
      return (
        <div className="text-left">
          <Link href={`/orderlist/${value}`} className="text-blue-600 hover:underline">
            {value}
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "store_name",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <Store className="h-4 w-4 mr-2 text-indigo-600" />
        Store Name
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
          <Store className="h-4 w-4 text-white" />
        </div>
        <div className="font-medium text-gray-900 max-w-[200px] truncate">
          {row.original.store_name || "Unknown Store"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "order_type",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <Truck className="h-4 w-4 mr-2 text-green-600" />
        Order Type
      </div>
    ),
    cell: ({ row }) => getOrderTypeBadge(row.original.order_type),
  },
  {
    accessorKey: "customer_name",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <User className="h-4 w-4 mr-2 text-rose-600" />
        Customer
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-gray-900">
          {row.original.customer_name || "Guest"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "order_total",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold text-left hover:bg-transparent"
      >
        <DollarSign className="h-4 w-4 mr-2 text-green-600" />
        Order Total
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <span className="font-bold text-green-800 text-sm">
          {formatCurrency(row.original.order_total)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "date_created",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold text-left hover:bg-transparent"
      >
        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
        Date Created
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">
          {formatDate(row.original.date_created)}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
        Status
      </div>
    ),
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    accessorKey: "customer_email",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <Mail className="h-4 w-4 mr-2 text-cyan-600" />
        Email
      </div>
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        {row.original.customer_email ? (
          <span className="text-cyan-700 hover:text-cyan-800 cursor-pointer text-sm truncate block">
            {row.original.customer_email}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">No email</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "customer_phone",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <Phone className="h-4 w-4 mr-2 text-emerald-600" />
        Phone
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm text-gray-900">
        {row.original.customer_phone || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "del_datetime",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <Clock className="h-4 w-4 mr-2 text-orange-600" />
        Delivery Date
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">
          {formatDate(row.original.del_datetime)}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "store_id",
    header: () => (
      <div className="flex items-center font-semibold">
        <MapPin className="h-4 w-4 mr-2 text-purple-600" />
        Store ID
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2 py-1 text-purple-800 font-mono text-xs">
        {row.original.store_id}
      </div>
    ),
  },
  {
    accessorKey: "tot_charges",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold text-left hover:bg-transparent"
      >
        <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
        Total Charges
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-semibold flex justify-center text-blue-700">
        {formatCurrency(row.original.tot_charges)}
      </span>
    ),
  },
  {
    accessorKey: "order_tot_tax",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        Tax
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-orange-700 font-medium flex justify-center">
        {formatCurrency(row.original.order_tot_tax)}
      </span>
    ),
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold text-left hover:bg-transparent"
      >
        Discount
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-red-600 font-medium flex justify-center">
        -{formatCurrency(row.original.discount)}
      </span>
    ),
  },
  {
    accessorKey: "order_payable_amt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold text-left hover:bg-transparent"
      >
        Payable Amount
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="px-3 py-2">
        <span className="font-bold text-green-800 flex justify-center">
          {formatCurrency(row.original.order_payable_amt)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "channel",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        Channel
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2 py-1  text-indigo-800 text-xs font-medium">
        {row.original.channel || "Direct"}
      </div>
    ),
  },
  {
    accessorKey: "fetched_at_pos",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        Fetched At POS
      </div>
    ),
    cell: ({ row }) => {
      const value = row.original?.fetched_at_pos === 'N' ? 'No' : 'Yes';
      const isYes = value === 'Yes';
      return (
        <span className={`items-center gap-1.5 px-2 py-1 text-xs font-medium flex justify-center`}>
          {isYes ? <CheckCircle className="h-3 w-3 " /> : <XCircle className="h-3 w-3" />}
          {value}
        </span>
      );
    }
  },
  {
    accessorKey: "processed_at_pos",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        Processed At POS
      </div>
    ),
    cell: ({ row }) => {
      const value = row.original?.processed_at_pos === 'N' ? 'No' : 'Yes';
      const isYes = value === 'Yes';
      return (
        <span className={`items-center gap-1.5 px-2 py-1 text-xs font-medium flex justify-center`}>
          {isYes ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {value}
        </span>
      );
    }
  },
  {
    accessorKey: "exp_pickup_time",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <Clock className="h-4 w-4 mr-2 text-amber-600" />
        Expected Pickup
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {formatDate(row.original.exp_pickup_time)}
      </div>
    ),
  },
  {
    accessorKey: "pos_processed_time",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <Clock className="h-4 w-4 mr-2 text-green-600" />
        POS Processed
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {formatDate(row.original.pos_processed_time)}
      </div>
    ),
  },
  {
    accessorKey: "fetched_by_pos_time",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <Clock className="h-4 w-4 mr-2 text-purple-600" />
        Fetched By POS
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {formatDate(row.original.fetched_by_pos_time)}
      </div>
    ),
  },
  {
    accessorKey: "landed",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        <MapPin className="h-4 w-4 mr-2 text-teal-600" />
        Landed
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">
        {formatDateISO(row.original.landed) || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "app_uid",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        App UID
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-gray-600 max-w-[120px] truncate">
        {row.original.app_uid || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "ext_platform_id",
    header: () => (
      <div className="flex items-center text-left font-semibold">
        Platform ID
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-gray-600">
        {row.original.ext_platform_id || "N/A"}
      </div>
    ),
  },
];