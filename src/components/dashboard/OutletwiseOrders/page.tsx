"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Outletwise Orders</CardTitle>
                <CardDescription>Orders by outlet location</CardDescription>
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
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="col2"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 12) + (value.length > 12 ? "..." : "")}
                                
                            />

                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Bar dataKey="col3" fill="#f0f0f5" radius={4} stroke="#000000" strokeWidth={1} rx={4}    >

                                {/* <LabelList
                                    dataKey="col2"
                                    position="insideLeft"
                                    offset={8}
                                    formatter={(value: string) => (value.length > 15 ? value.slice(0, 15) + "..." : value)}
                                    fontSize={12}
                                    fill="#000000"
                                /> */}
                                <LabelList
                                    dataKey="col3"
                                    position="right"
                                    offset={8}
                                    fontSize={12} />
                            </Bar>
                        </BarChart>
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
