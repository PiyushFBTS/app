"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import axios from "axios"
import { useEffect, useState } from "react"
import { OrdersList } from "@/types/dashboard.type"

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

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("api/dashboard/outletwiseOrders")
            setOrder(res.data)
        }
        fetchData()
    }, [])



    const barHeight = 40
    const chartHeight = Math.max(400, order.length * barHeight)
    const maxVisibleHeight = 500

    return (
        <Card className="overflow-hidden scrollbar-hide h-[600px]  hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center">Outletwise Orders</CardTitle>
                {/* <CardDescription>Orders by outlet location</CardDescription> */}
            </CardHeader>
            <CardContent>
                <div
                    className="overflow-y-auto"
                    style={{
                        height: order.length > 12 ? `${maxVisibleHeight}px` : "auto",
                        maxHeight: `${maxVisibleHeight}px`,

                    }}
                >
                    <ChartContainer config={chartConfig} className="w-full " style={{ height: `${chartHeight}px` }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                accessibilityLayer
                                data={order}
                                layout="vertical"
                                width={800}
                                height={chartHeight}
                                margin={{
                                    left: 20,
                                    right: 16,
                                }}
                            >
                                <CartesianGrid horizontal={false} />
                                <XAxis type="number" hide domain={[0, 100]} tickCount={10}  />
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
                                        // Calculate color intensity based on value (assuming data is sorted high to low)
                                        const intensity = index / (order.length - 1); // normalized 0 → 1
                                        const hue = 220 - intensity * 220; // range: 220 (blue) → 0 (red)
                                        const color = `hsl(${hue}, 70%, 50%)`; // keeps saturation & lightness consistent

                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                    <LabelList
                                        dataKey="col2"
                                        position="insideLeft"
                                        offset={8}
                                        formatter={(value: string) => (value.length > 15 ? value.slice(0, 15) + "..." : value)}
                                        fontSize={12}
                                        fill="#fff"
                                    />
                                    <LabelList
                                        dataKey="col3"
                                        position="right"
                                        offset={8}
                                        fontSize={12} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div> */}
                <div className="text-muted-foreground leading-none">Showing total orders by outlet location</div>
            </CardFooter>
        </Card>
    )
}
