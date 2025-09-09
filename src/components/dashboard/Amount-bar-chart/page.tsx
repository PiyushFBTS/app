"use client"
import { CustomBarChart } from "@/components/dashboard/custom-charts/bar-chart/page";

import axios from "axios"
import { useEffect, useState } from "react"
import { TotalAmount } from "@/types/pie-chart.type";

function AmountBarChart() {

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <CustomBarChart
          title="Top 10 by Amount for Today"
          description="sales by amount for today"
          data={totalAmount}
        />
        <CustomBarChart
          title="Top 10 by Amount This Month"
          description="sales by amount for this month"
          data={totalAmountThisMount}
        />
      </div>
    </>
  )
}

export default AmountBarChart
