"use client"
import { CustomPieChart } from "@/components/dashboard/custom-charts/pie-chart/page";
import axios from "axios";
import { useEffect, useState } from "react";
import { TotalQty } from "@/types/pie-chart.type";
import { Card, CardContent } from "@/components/ui/card";

function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card className="p-6 bg-white shadow-md border border-gray-200 rounded-2xl">
      <CardContent className="p-0 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
        <div className="text-center text-gray-400 text-sm animate-pulse">{title}</div>
      </CardContent>
    </Card>
  );
}

function QuantityPieData() {
  const [totalQty, setTotalQty] = useState<TotalQty[]>([]);
  const [totalQtyThisMonth, setTotalQtyThisMonth] = useState<TotalQty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url = process.env.NEXT_PUBLIC_API_URL

      try {
        const [resQty, resQtyThisMonth] = await Promise.all([
          axios.get(`${url}/dashboard/pie-chart/today/todaysTop10Qty`),
          axios.get(`${url}/dashboard/pie-chart/monthly/thisMonthTodaysTop10Qty`)
        ]);
        setTotalQty(resQty.data);
        setTotalQtyThisMonth(resQtyThisMonth.data);
        
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //Show skeletons while loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartSkeleton title="Top 10 Item by Quantity for Today" />
        <ChartSkeleton title="Top 10 Item by Quantity This Month" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CustomPieChart
        title="Top 10 Item by Quantity for Today"
        data={totalQty}
      />
      <CustomPieChart
        title="Top 10 Item by Quantity This Month"
        data={totalQtyThisMonth}
      />
    </div>
  );
}

export default QuantityPieData
