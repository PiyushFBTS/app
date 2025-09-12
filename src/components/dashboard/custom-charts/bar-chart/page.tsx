"use client"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, ResponsiveContainer, Cell, Text } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { TotalAmount } from "@/types/pie-chart.type"
import { useIsMobile } from "@/hooks/use-mobile"

// Props for reusability
interface BarChartCardProps {
    title: string
    description?: string
    data: TotalAmount[]
}

// Color palette (same style as pie chart)
const PROFESSIONAL_COLORS = [
    "#3B82F6", // Bright Blue
    "#10B981", // Emerald Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#84CC16", // Lime
    "#EC4899", // Pink
    "#6366F1", // Indigo
]

// truncate helper
const truncate = (str: string, max: number) => (str.length > max ? str.slice(0, max) + "…" : str)

// custom vertical label
const VerticalValueLabel = (props: any) => {
    const { x, y, width, height, value } = props

    // font size: 10px for small screens (<640px), otherwise 12px
    const fontSize = typeof window !== "undefined" && window.innerWidth < 640 ? 10 : 12

    return (
        <Text
            x={x! + width! / 2}
            y={y! + height! / 2}
            textAnchor="middle"
            verticalAnchor="middle"
            angle={-90}
            fill="#fff"
            fontSize={fontSize}
            fontWeight="600"
        >
            {value}
        </Text>
    )
}

const VerticalBottomLabel = (props: any) => {
    const { x, y, width, height, value } = props
    const truncated = truncate(value, 13)

    // font size: 10px for small screens (<640px), otherwise 12px
    const fontSize = typeof window !== "undefined" && window.innerWidth < 640 ? 10 : 12

    return (
        <Text
            x={x! + width! / 2}
            y={y! + height! + 25}
            textAnchor="end"
            verticalAnchor="start"
            angle={-70}
            fill="currentColor"
            fontSize={fontSize}
            fontWeight="500"
        >
            {truncated}
        </Text>
    )
}

export function CustomBarChart({ title, description, data }: BarChartCardProps) {
    const isMobile = useIsMobile();
    if (!data || data.length === 0) {
        return (
            <Card className="flex flex-col h-[400px] shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="items-center pb-0 h-[80px] flex flex-col justify-center">
                    <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
                    {description && <CardDescription className="text-center">{description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">No data available</p>
                </CardContent>
            </Card>
        )
    }

    // Transform API data for recharts
    const chartData = data.map((item, index) => ({
        id: `${item.item_code}-${index}`,
        name: item.item_name,
        value: Number(item.amt),
        fill: PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length],
    }))

    const chartConfig = chartData.reduce((config, item) => {
        config[item.id] = {
            label: item.name,
            color: item.fill,
        }
        return config
    }, {} as ChartConfig)

    return (
        <Card className="flex flex-col h-[600px] shadow-lg  hover:shadow-xl transition-shadow duration-300 pb-4">
            <CardHeader className="items-center pb-0 h-[80px] flex flex-col justify-center">
                <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
                {description && <CardDescription className="text-center">{description}</CardDescription>}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col px-2">
                <ChartContainer config={chartConfig} className="w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 20,
                                left: 10,
                                bottom: 100,
                            }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />

                            {/* XAxis hidden since names are inside bars */}
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={false} />

                            <Tooltip content={<ChartTooltipContent />} />

                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {/* vertical item value inside bars */}
                                <LabelList dataKey="value" content={<VerticalValueLabel />} className="" />
                                {/* name in below */}
                                <LabelList dataKey="name" content={<VerticalBottomLabel />} />

                                {chartData.map((entry) => (
                                    <Cell key={`cell-${entry.id}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
