"use client"

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

type ChartDataType = {
  qty: number | string // Can be string or number from API
  item_code: string
  item_name: string
}

interface CustomPieChartProps {
  title: string
  description?: string
  data?: ChartDataType[] // Made data optional to prevent runtime errors
}

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
  "#14B8A6", // Teal
  "#F43F5E", // Rose
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Value: <span className="font-medium text-foreground">{data.value.toLocaleString()}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Percentage:{" "}
          <span className="font-medium text-foreground">
            {((data.value / payload[0].payload.total) * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    )
  }
  return null
}

const renderActiveShape = (props: any) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius,
    startAngle, endAngle, fill, payload, value
  } = props;

  // move slice outward by 10px
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 30} // push outward
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function CustomPieChart({ title, description, data = [] }: CustomPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col h-[500px] shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="items-center pb-0 h-[80px] flex flex-col justify-center">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center">
            {title}
          </CardTitle>
          <div className="h-[20px] flex items-center justify-center">
            {description && (
              <CardDescription className="text-center text-muted-foreground text-sm">{description}</CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-6 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-muted-foreground font-medium">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Transform API data to recharts format with proper number conversion
  const chartData = data.map((item, index) => ({
    id: `${item.item_code}-${index}`, // More stable unique key using item_code
    name: item.item_name,
    value: typeof item.qty === "string" ? Number.parseFloat(item.qty) : item.qty, // Convert string to number
    fill: PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length],
  }))

  // Filter out invalid data (NaN values)
  const validChartData = chartData.filter((item) => !isNaN(item.value) && item.value > 0)

  const total = validChartData.reduce((sum, item) => sum + item.value, 0)
  const dataWithTotal = validChartData.map((item) => ({ ...item, total }))

  console.log("Original Data:", data)
  console.log("Transformed Chart Data:", validChartData)

  // Create config object for ChartContainer
  const chartConfig = validChartData.reduce(
    (config, item, index) => {
      config[item.id] = {
        label: item.name,
        color: PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length],
      }
      return config
    },
    {} as Record<string, { label: string; color: string }>,
  )
  const maxIndex = dataWithTotal.reduce(
    (maxIdx, item, idx, arr) => (item.value > arr[maxIdx].value ? idx : maxIdx),
    0
  );
  return (
    <Card className="flex flex-col h-[700px] gap-2 shadow-lg border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-xl transition-shadow duration-300">
      {/* Fixed height header with consistent spacing */}
      <CardHeader className="items-center pb-0 h-[80px] flex flex-col justify-center">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center">
          {title}
        </CardTitle>
        {/* Reserve space for description even if it doesn't exist */}
        <div className="h-[20px] flex items-center justify-center">
          {description && (
            <CardDescription className="text-center text-muted-foreground text-sm line-clamp-1 px-2">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <div className="h-[30px] flex items-center justify-center ">
        <div className="flex justify-center items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Total Orders</p>
            <p className="font-bold text-base text-foreground">{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
      {/* Chart content with consistent height */}
      <CardContent className="flex-1 pb-6 flex flex-col">
        {/* Chart container with fixed dimensions */}
        <div className="flex-1 flex items-center justify-center">
          <ChartContainer config={chartConfig} className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>


                <Pie
                  data={dataWithTotal}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={40} // makes it a donut
                  stroke="#ffffff"
                  strokeWidth={2}
                  activeIndex={maxIndex}        // highlight the biggest slice
                  activeShape={renderActiveShape} // use custom renderer
                >
                  {dataWithTotal.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.fill}
                      className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />

              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {validChartData.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors duration-200"
            >
              <div
                className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium text-foreground truncate" title={item.name}>
                {item.name}
              </span>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}