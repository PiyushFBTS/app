"use client"

import { columns } from "./columns";
import { OrderDetailTable } from "./data-table";
import axios from "axios";
import React, { useEffect, useState } from 'react';

export default function OrderList() {
  const [orderDetail, setOrderDetail] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchOrderDetailData();
  }, []);

  return (
    <div className="w-full h-full overflow-auto ">
      {loading ? (
        <div className="w-full min-h-min flex items-center justify-center text-gray-500">
          Loading...
        </div>
      ) : (
        <div className="w-full h-full overflow-x-auto overflow-y-auto">
          <OrderDetailTable columns={columns} data={orderDetail} />
        </div>
      )}
    </div>
  );
}
