"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MonthlyAggregation, IncomeSource } from "@/types/income"
import { formatMonth } from "@/lib/format"

type IncomeAreaChartProps = {
  months: MonthlyAggregation[]
  sources: IncomeSource[]
}

export function IncomeAreaChart({ months, sources }: IncomeAreaChartProps) {
  const activeSources = sources.filter((s) => s.isActive)

  const chartConfig: ChartConfig = Object.fromEntries(
    activeSources.map((s) => [s.id, { label: s.name, color: s.color }])
  )

  const chartData = months.map((m) => {
    const row: Record<string, string | number> = { month: m.month }
    for (const source of activeSources) {
      row[source.id] = (m.sources[source.id] ?? 0) / 100
    }
    return row
  })

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Over Time</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          No data for selected period
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={(v) => formatMonth(v)}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => formatMonth(v as string)}
                  formatter={(value, name) => {
                    const source = activeSources.find((s) => s.id === name)
                    return (
                      <span>
                        {source?.name}: ₴{Number(value).toLocaleString("uk-UA")}
                      </span>
                    )
                  }}
                />
              }
            />
            {activeSources.map((source) => (
              <Area
                key={source.id}
                dataKey={source.id}
                type="monotone"
                fill={`var(--color-${source.id})`}
                stroke={`var(--color-${source.id})`}
                fillOpacity={0.4}
                stackId="income"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
