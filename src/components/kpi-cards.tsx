"use client"

import { DollarSign, Layers, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardData, IncomeSource } from "@/types/income"
import { formatCurrency } from "@/lib/format"

type KpiCardsProps = {
  data: DashboardData
  sources: IncomeSource[]
}

export function KpiCards({ data, sources }: KpiCardsProps) {
  const topSource = sources.find((s) => s.id === data.topSourceId)
  const isHighRisk = data.topSourcePercentage > 50

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.totalIncome)}</div>
          <p className="text-xs text-muted-foreground">
            For selected period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeSourcesCount}</div>
          <p className="text-xs text-muted-foreground">
            Income streams
          </p>
        </CardContent>
      </Card>

      <Card className={isHighRisk ? "border-destructive" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dependency Risk</CardTitle>
          <AlertTriangle
            className={`h-4 w-4 ${isHighRisk ? "text-destructive" : "text-muted-foreground"}`}
          />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isHighRisk ? "text-destructive" : ""}`}>
            {data.topSourcePercentage}%
          </div>
          <p className="text-xs text-muted-foreground">
            {topSource ? topSource.name : "No data"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
