import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, LineChart, Line, BarChart, Bar, PieChart, Pie } from "recharts"

import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import {
    AreaChartIcon,
    BarChartIcon,
    ChartLineIcon,
    PieChartIcon,
    Spline,
    GitCommitHorizontal

} from "lucide-react"
export type ChartData = {

    date: string;
    caldeireiro: number;
    eletricista: number;
    mecanico: number;
    operador: number;
    pintor: number;
}


// Helper function to generate gradients
const genGrads = (name: string, color: string) => {
    return <linearGradient id={`fill${name}`} x1="0" y1="0" x2="0" y2="1" key={name}>
        <stop
            offset="5%"
            stopColor={color}
            stopOpacity={0.8}
        />
        <stop
            offset="95%"
            stopColor={color}
            stopOpacity={0.1}
        />
    </linearGradient>
}

// Function to generate chart based on type
const genChart = (type: string, data: any[], chartConfig: ChartConfig, useSpline: boolean): React.JSX.Element => {
    // Improves legend and tooltip by filtering only the selected functions
    // Do the same for area when implementing pie chart
    if (type === "area") {
        return (
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 6,
                    right: 6,
                }}
            >
                <CartesianGrid vertical={true} />
                <XAxis
                    dataKey="date"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={2}
                    tickCount={30}
                />
                <YAxis domain={[0, 'dataMax + 20']} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                    {
                        Object.entries(chartConfig).map(([key, config]) => genGrads(key, config.color || "blue"))
                    }
                </defs>
                {
                    Object.entries(chartConfig).map(([key, config]) => {
                        return (
                            <Area
                                dataKey={key}
                                type={useSpline ? "natural" : "linear"}
                                fill={`url(#fill${key})`}
                                fillOpacity={0.4}
                                stroke={config.color}
                                stackId="a"

                            />
                        )
                    })
                }
                <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>)
    }

    if (type === "line") {
        return (
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={true} />
                <XAxis
                    dataKey="date"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={2}
                    tickCount={30}
                />
                <YAxis domain={[0, 'dataMax + 5']} />
                {
                    Object.entries(chartConfig).map(([key, config]) => {
                        return (
                            <Line
                                dataKey={key}
                                type={useSpline ? "natural" : "linear"}
                                stroke={config.color}
                                strokeWidth={2}
                                key={key}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        )

                    })
                }
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                <ChartLegend content={<ChartLegendContent />} />
            </LineChart>)
    }

    if (type === "bar") {
        return (
            <BarChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={true} />
                <XAxis
                    dataKey="date"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={2}
                    tickCount={30}
                />
                <YAxis domain={[0, 'dataMax*1.1']} />
                {
                    Object.entries(chartConfig).map(([key, config]) => {
                        return (
                            <Bar
                                dataKey={key}
                                fill={config.color}
                                key={key}
                            />
                        )

                    })
                }
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
        )
    }

    if (type === "pie") {
        const pieData = [];
        data.forEach(item => {
            Object.entries(chartConfig).forEach(([key, config]) => {
                pieData.push({
                    name: config.label,
                    value: item[key] || 0,
                    fill: config.color
                });
            });
        });
        return (
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={data} dataKey="area" nameKey="browser" />
            </PieChart>
        )
    }
    return <></>
}

export default function MainChart({ data, chartConfig }: { data: ChartData[], chartConfig: ChartConfig }) {

    const [chartType, setChartType] = React.useState("area");
    const [useSpline, setUseSpline] = React.useState(true);

    return (

        <div className="w-full h-full">
            <div className="flex flex-row justify-between items-center px-4 mb-2">
                <ToggleGroup type="single" value={chartType} className=" border " aria-label="Chart Type Toggle"
                    onValueChange={(value) => {
                        if (value) setChartType(value)
                    }}>
                    <ToggleGroupItem value="area" className='hover:cursor-pointer'
                    ><AreaChartIcon /></ToggleGroupItem>
                    <ToggleGroupItem value="line" className='hover:cursor-pointer'
                    ><ChartLineIcon /></ToggleGroupItem>
                    <ToggleGroupItem value="bar" className='hover:cursor-pointer'
                    ><BarChartIcon /></ToggleGroupItem>
                    <ToggleGroupItem value="pie" className='hover:cursor-pointer'
                    ><PieChartIcon /></ToggleGroupItem>

                </ToggleGroup>
                <ToggleGroup type="single" value={"" + useSpline} className={`border ${chartType == "area" || chartType == "line" ? "" : "hidden"}`} aria-label="Spline Toggle"
                    onValueChange={(value) => {
                        if (value) setUseSpline(value === "true")
                    }}>
                    <ToggleGroupItem value={'true'} className='hover:cursor-pointer'
                    ><Spline /></ToggleGroupItem>
                    <ToggleGroupItem value={'false'} className='hover:cursor-pointer'
                    ><GitCommitHorizontal /></ToggleGroupItem>
                </ToggleGroup>
            </div>
            <ChartContainer config={chartConfig}>
                {genChart(chartType, data, chartConfig, useSpline)}
            </ChartContainer>

        </div>

    )
}