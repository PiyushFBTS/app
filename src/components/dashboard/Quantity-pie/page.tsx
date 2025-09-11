"use client"
import { CustomPieChart } from "@/components/dashboard/custom-charts/pie-chart/page";
import axios from "axios"
import { useEffect, useState } from "react"
import { TotalQty } from "@/types/pie-chart.type";

function QuantityPieData() {
  const [totalQty, setTotalQty] = useState<TotalQty[]>([]);
  const [totalQtyThisMount, setTotalQtyThisMount] = useState<TotalQty[]>([]);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const resQty = await axios.get("/api/dashboard/pie-chart/Todays/TodaysTop10Qty");
        setTotalQty(resQty.data);

        const resQtyThisMonth = await axios.get("/api/dashboard/pie-chart/Monthly/ThisMonthTodaysTop10Qty");
        setTotalQtyThisMount(resQtyThisMonth.data);

      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomPieChart
          title="Top 10 by Quantity for Today"
          description="sales by quantity for today"
          data={totalQty}
        />
        <CustomPieChart
          title="Top 10 by Quantity This Month"
          description="sales by quantity for this month"
          data={totalQtyThisMount}
        />
      </div>
    </>
  )
}

export default QuantityPieData
