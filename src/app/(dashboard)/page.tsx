"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeriodSelector } from "@/components/period-selector"
import { KpiCards } from "@/components/kpi-cards"
import { IncomeAreaChart } from "@/components/income-area-chart"
import { IncomeDonutChart } from "@/components/income-donut-chart"
import {
  useIncomeSources,
  useIncomeEntries,
  useDashboardData,
} from "@/hooks/use-income-data"
import { FAMILY_MEMBERS } from "@/lib/mock-data"
import { getDefaultPeriodFilter } from "@/lib/format"
import type { PeriodFilter } from "@/types/income"

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodFilter>(getDefaultPeriodFilter)
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined)

  const { sources } = useIncomeSources()
  const { entries } = useIncomeEntries()
  const dashboardData = useDashboardData(sources, entries, period, ownerId)

  const filteredSources = ownerId
    ? sources.filter((s) => s.ownerId === ownerId)
    : sources

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PeriodSelector value={period} onChange={setPeriod} />
        <Tabs
          value={ownerId ?? "all"}
          onValueChange={(v) => setOwnerId(v === "all" ? undefined : v)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {FAMILY_MEMBERS.map((m) => (
              <TabsTrigger key={m.id} value={m.id}>
                {m.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <KpiCards data={dashboardData} sources={sources} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncomeAreaChart months={dashboardData.months} sources={filteredSources} />
        </div>
        <div>
          <IncomeDonutChart months={dashboardData.months} sources={filteredSources} />
        </div>
      </div>
    </div>
  )
}
