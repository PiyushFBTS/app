"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import axios from "axios"
import { useEffect, useState } from "react"
import { OrdersList } from "@/types/dashboard.type"

// Skeleton Loader Component
function BarChartSkeleton() {
  return (
    <Card className="overflow-hidden h-[600px] p-6 bg-white shadow-md border border-gray-200 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent animate-pulse">
          Outletwise Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-400 animate-pulse">
        Showing total orders by outlet location
      </CardFooter>
    </Card>
  )
}

export const description = "A horizontal bar chart"

const chartConfig = {
  col3: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export function OutletwiseOrders() {
  const [order, setOrder] = useState<OrdersList[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const url = process.env.NEXT_PUBLIC_API_URL

      try {
        const res = await axios.get(`${url}/api/dashboard/outletwiseOrders`)
        setOrder(res.data)
      } catch (err) {
        console.error("Error fetching Outletwise Orders:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <BarChartSkeleton />
  }

  const barHeight = 40
  const chartHeight = Math.max(400, order.length * barHeight)
  const maxVisibleHeight = 500

  return (
    <Card className="overflow-hidden scrollbar-hide h-[600px] hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center">
          Outletwise Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="overflow-y-auto"
          style={{
            height: order.length > 12 ? `${maxVisibleHeight}px` : "auto",
            maxHeight: `${maxVisibleHeight}px`,
          }}
        >
          <ChartContainer config={chartConfig} className="w-full" style={{ height: `${chartHeight}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={order}
                layout="vertical"
                width={800}
                height={chartHeight}
                margin={{ left: 20, right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide domain={[0, 100]} tickCount={10} />
                <YAxis
                  dataKey="col2"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fill="#fff"
                  tickFormatter={(value) => value.slice(0, 12) + (value.length > 12 ? "..." : "")}
                  hide
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="col3" radius={4} stroke="#3b82f6" strokeWidth={1} rx={4}>
                  {order.map((entry, index) => {
                    const intensity = index / (order.length - 1)
                    const hue = 220 - intensity * 220
                    const color = `hsl(${hue}, 70%, 50%)`
                    return <Cell key={`cell-${index}`} fill={color} />
                  })}
                  <LabelList
                    dataKey="col2"
                    position="insideLeft"
                    offset={8}
                    formatter={(value: string) => (value.length > 15 ? value.slice(0, 15) + "..." : value)}
                    fontSize={12}
                    fill="#fff"
                  />
                  <LabelList dataKey="col3" position="right" offset={8} fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">Showing total orders by outlet location</div>
      </CardFooter>
    </Card>
  )
}
