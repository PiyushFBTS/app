"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import ItemCard from "@/components/dashboard/item-card/page"
import { OutletwiseOrders } from "@/components/dashboard/OutletwiseOrders/page"
import axios from "axios"
import { useEffect, useState } from "react"
import { TotalAmount, TotalQty } from "@/types/pie-chart.type";
import QuantityPieData from "@/components/dashboard/Quantity-pie/page";
import AmountBarChart from "@/components/dashboard/Amount-bar-chart/page";


function Dashboard() {
  const user = useSelector((state: RootState) => state.user)
  const [totalAmount, setTotalAmount] = useState<TotalAmount[]>([]);
  const [totalAmountThisMount, setTotalAmountThisMount] = useState<TotalAmount[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching chart data...");
      try {
        const resAmount = await axios.get("/api/dashboard/pie-chart/Todays/TodaysTop10Amount");
        setTotalAmount(resAmount.data);

        const resAmountThisMonth = await axios.get("/api/dashboard/pie-chart/Monthly/ThisMonthTodaysTop10Amount");
        setTotalAmountThisMount(resAmountThisMonth.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="space-y-2">
        <div className="p-4">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Third Wave Coffee online order management system</h1>
        </div>

        {/* Display user information */}
        <div className="bg-card m-4 p-4 rounded-lg border">
          <div className="space-y-1">
            <p>
              <strong> Hello ,</strong> {user.first_name} {user.last_name}
            </p>
          </div>
        </div>
        <div>
          <ItemCard />
        </div>
        <div className="grid gap-4 xl:grid-cols-2 m-4">
          <QuantityPieData />
          <OutletwiseOrders />

        </div>
        <div className="grid gap-4 mb-20  ">
          <AmountBarChart />
        </div>
      </div>
    </>
  )
}

export default Dashboard
