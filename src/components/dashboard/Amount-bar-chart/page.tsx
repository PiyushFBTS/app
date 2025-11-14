"use client"
import { CustomBarChart } from "@/components/dashboard/custom-charts/bar-chart/page";
import axios from "axios";
import { useEffect, useState } from "react";
import { TotalAmount } from "@/types/pie-chart.type";
import { Card, CardContent } from "@/components/ui/card";


function BarChartSkeleton({ title }: { title: string }) {
  return (
    <Card className="p-6 bg-white shadow-md border border-gray-200 rounded-2xl">
      <CardContent className="space-y-4">
        {/* Skeleton Title */}
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>

        {/* Skeleton Bars */}
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Skeleton Footer */}
        <div className="h-5 bg-gray-100 rounded w-1/2 animate-pulse mt-4"></div>
        <div className="text-center text-gray-400 text-sm animate-pulse">{title}</div>
      </CardContent>
    </Card>
  );
}

function AmountBarChart() {
  const [totalAmount, setTotalAmount] = useState<TotalAmount[]>([]);
  const [totalAmountThisMonth, setTotalAmountThisMonth] = useState<TotalAmount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url = process.env.NEXT_PUBLIC_API_URL

      try {
        const [resAmount, resAmountThisMonth] = await Promise.all([
          axios.get(`${url}/api/dashboard/pie-chart/today/todaysTop10Amount`),
          axios.get(`${url}/api/dashboard/pie-chart/monthly/thisMonthTodaysTop10Amount`)
        ]);
        console.log("todaysTop10Amount",`${url}/api/dashboard/pie-chart/today/todaysTop10Amount`);
        console.log("thisMonthTodaysTop10Amount",`${url}/api/dashboard/pie-chart/monthly/thisMonthTodaysTop10Amount`);
        

        setTotalAmount(resAmount.data);
        setTotalAmountThisMonth(resAmountThisMonth.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show skeletons while data loads
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChartSkeleton title="Top 10 Item by Amount for Today" />
        <BarChartSkeleton title="Top 10 Item by Amount This Month" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CustomBarChart
        title="Top 10 Item by Amount for Today"
        description="Sales by amount for Today"
        data={totalAmount}
      />
      <CustomBarChart
        title="Top 10 Item by Amount This Month"
        description="Sales by amount for this Month"
        data={totalAmountThisMonth}
      />
    </div>
  );
}

export default AmountBarChart
