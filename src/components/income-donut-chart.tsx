"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MonthlyAggregation, IncomeSource } from "@/types/income"

type IncomeDonutChartProps = {
  months: MonthlyAggregation[]
  sources: IncomeSource[]
}

export function IncomeDonutChart({ months, sources }: IncomeDonutChartProps) {
  const activeSources = sources.filter((s) => s.isActive)

  const sourceTotals = new Map<string, number>()
  for (const month of months) {
    for (const [sourceId, amount] of Object.entries(month.sources)) {
      sourceTotals.set(sourceId, (sourceTotals.get(sourceId) ?? 0) + amount)
    }
  }

  const pieData = activeSources
    .map((s) => ({
      id: s.id,
      name: s.name,
      value: (sourceTotals.get(s.id) ?? 0) / 100,
      color: s.color,
    }))
    .filter((d) => d.value > 0)

  const chartConfig: ChartConfig = Object.fromEntries(
    pieData.map((d) => [d.id, { label: d.name, color: d.color }])
  )

  if (pieData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Breakdown</CardTitle>
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
        <CardTitle>Income Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `₴${Number(value).toLocaleString("uk-UA")}`}
                  nameKey="name"
                />
              }
            />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {pieData.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
