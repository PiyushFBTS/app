"use client"

import { columns } from "./columns";
import { OrderDetailTable } from "./data-table";
import axios from "axios";
import React, { useEffect, useState } from 'react';

export default function OrderList() {
  const [orderDetail, setOrderDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetailData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/dashboard/orderlist');
        setOrderDetail(response.data[0].get_order_list_as_json);
      } catch (error) {
        console.error("Error fetching Order Data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetailData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          {/* Header skeleton */}
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
          {/* Table rows skeleton */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto pb-10">
      <div className="w-full h-full overflow-x-auto overflow-y-auto">
        <OrderDetailTable columns={columns} data={orderDetail} />
      </div>
    </div>
  );
}
