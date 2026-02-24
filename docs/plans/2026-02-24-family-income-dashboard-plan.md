# Family Income Dashboard — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 3-page family income dashboard with KPI cards, stacked area chart, donut chart, and CRUD for income sources and entries.

**Architecture:** Route group `(dashboard)` with sidebar layout. Server Component layout, Client Components for interactive pages. Mock data via useState hooks simulating backend CRUD. Recharts for charts via shadcn ChartContainer wrapper.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5 strict, Tailwind CSS v4, shadcn/ui, Recharts, React Hook Form + Zod 4

---

### Task 1: TypeScript Types

**Files:**
- Create: `src/types/income.ts`

**Step 1: Create types file**

```typescript
// src/types/income.ts

export type FamilyMember = {
  id: string
  name: string
}

export type IncomeSource = {
  id: string
  name: string
  ownerId: string
  color: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type IncomeEntry = {
  id: string
  sourceId: string
  amount: number
  month: string
  note: string
  createdAt: string
  updatedAt: string
}

export type PeriodFilter = {
  type: "monthly" | "quarterly" | "yearly" | "custom"
  startMonth: string
  endMonth: string
}

export type MonthlyAggregation = {
  month: string
  total: number
  sources: Record<string, number>
}

export type DashboardData = {
  period: PeriodFilter
  months: MonthlyAggregation[]
  totalIncome: number
  activeSourcesCount: number
  topSourceId: string
  topSourcePercentage: number
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes, no TypeScript errors.

**Step 3: Commit**

```bash
git add src/types/income.ts
git commit -m "feat: add domain types for income dashboard"
```

---

### Task 2: Zod Validation Schemas

**Files:**
- Create: `src/lib/schemas.ts`

**Step 1: Create schemas**

```typescript
// src/lib/schemas.ts
import { z } from "zod"

export const incomeSourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  ownerId: z.string().min(1, "Owner is required"),
  color: z.string().min(1, "Color is required"),
})

export type IncomeSourceFormData = z.infer<typeof incomeSourceSchema>

export const incomeEntrySchema = z.object({
  sourceId: z.string().min(1, "Source is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Invalid month format"),
  note: z.string().optional().default(""),
})

export type IncomeEntryFormData = z.infer<typeof incomeEntrySchema>
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/lib/schemas.ts
git commit -m "feat: add Zod validation schemas for income forms"
```

---

### Task 3: Format Utilities

**Files:**
- Create: `src/lib/format.ts`

**Step 1: Create utilities**

```typescript
// src/lib/format.ts
import type { PeriodFilter } from "@/types/income"

export function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString("uk-UA", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-")
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString("uk-UA", { month: "long", year: "numeric" })
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export function getDefaultPeriodFilter(): PeriodFilter {
  const year = new Date().getFullYear()
  return {
    type: "yearly",
    startMonth: `${year}-01`,
    endMonth: `${year}-12`,
  }
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/lib/format.ts
git commit -m "feat: add currency and date format utilities"
```

---

### Task 4: Mock Data

**Files:**
- Create: `src/lib/mock-data.ts`

**Step 1: Create mock data**

```typescript
// src/lib/mock-data.ts
import type { FamilyMember, IncomeSource, IncomeEntry } from "@/types/income"

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: "member-1", name: "Volodymyr" },
  { id: "member-2", name: "Дружина" },
]

export const INITIAL_SOURCES: IncomeSource[] = [
  {
    id: "src-1",
    name: "Основна робота",
    ownerId: "member-1",
    color: "#4f46e5",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "src-2",
    name: "Фріланс React",
    ownerId: "member-1",
    color: "#06b6d4",
    isActive: true,
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "src-3",
    name: "Музичний канал",
    ownerId: "member-1",
    color: "#f59e0b",
    isActive: true,
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "src-4",
    name: "Основна робота",
    ownerId: "member-2",
    color: "#10b981",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "src-5",
    name: "Репетиторство",
    ownerId: "member-2",
    color: "#ec4899",
    isActive: true,
    createdAt: "2025-04-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
  },
  {
    id: "src-6",
    name: "Etsy магазин",
    ownerId: "member-2",
    color: "#8b5cf6",
    isActive: false,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-09-01T00:00:00Z",
  },
]

function generateEntries(): IncomeEntry[] {
  const entries: IncomeEntry[] = []
  const amounts: Record<string, number[]> = {
    "src-1": [8000000, 8000000, 8500000, 8500000, 9000000, 9000000, 9000000, 9500000, 9500000, 9500000, 10000000, 10000000],
    "src-2": [0, 0, 1500000, 2000000, 2500000, 3000000, 2000000, 3500000, 4000000, 3000000, 2500000, 5000000],
    "src-3": [0, 0, 0, 0, 0, 50000, 80000, 120000, 150000, 200000, 250000, 300000],
    "src-4": [6000000, 6000000, 6000000, 6500000, 6500000, 6500000, 7000000, 7000000, 7000000, 7000000, 7500000, 7500000],
    "src-5": [0, 0, 0, 800000, 800000, 1000000, 1000000, 1200000, 1200000, 1500000, 1500000, 1500000],
    "src-6": [300000, 250000, 400000, 350000, 200000, 150000, 100000, 0, 0, 0, 0, 0],
  }

  for (const [sourceId, monthlyAmounts] of Object.entries(amounts)) {
    for (let m = 0; m < 12; m++) {
      const amount = monthlyAmounts[m]
      if (amount === 0) continue
      const month = `2026-${String(m + 1).padStart(2, "0")}`
      entries.push({
        id: `entry-${sourceId}-${month}`,
        sourceId,
        amount,
        month,
        note: "",
        createdAt: `${month}-01T00:00:00Z`,
        updatedAt: `${month}-01T00:00:00Z`,
      })
    }
  }

  return entries
}

export const INITIAL_ENTRIES: IncomeEntry[] = generateEntries()
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/lib/mock-data.ts
git commit -m "feat: add mock data for income sources and entries"
```

---

### Task 5: Income Data Hooks

**Files:**
- Create: `src/hooks/use-income-data.ts`

**Step 1: Create hooks**

```typescript
// src/hooks/use-income-data.ts
"use client"

import { useState, useMemo, useCallback } from "react"
import type {
  IncomeSource,
  IncomeEntry,
  PeriodFilter,
  MonthlyAggregation,
  DashboardData,
} from "@/types/income"
import { INITIAL_SOURCES, INITIAL_ENTRIES } from "@/lib/mock-data"

export function useIncomeSources() {
  const [sources, setSources] = useState<IncomeSource[]>(INITIAL_SOURCES)

  const addSource = useCallback((data: { name: string; ownerId: string; color: string }) => {
    const now = new Date().toISOString()
    const newSource: IncomeSource = {
      id: `src-${crypto.randomUUID()}`,
      ...data,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }
    setSources((prev) => [...prev, newSource])
  }, [])

  const updateSource = useCallback((id: string, data: Partial<IncomeSource>) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
      )
    )
  }, [])

  const deleteSource = useCallback((id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { sources, addSource, updateSource, deleteSource }
}

export function useIncomeEntries() {
  const [entries, setEntries] = useState<IncomeEntry[]>(INITIAL_ENTRIES)

  const addEntry = useCallback((data: { sourceId: string; amount: number; month: string; note?: string }) => {
    const now = new Date().toISOString()
    const newEntry: IncomeEntry = {
      id: `entry-${crypto.randomUUID()}`,
      sourceId: data.sourceId,
      amount: data.amount,
      month: data.month,
      note: data.note ?? "",
      createdAt: now,
      updatedAt: now,
    }
    setEntries((prev) => [...prev, newEntry])
  }, [])

  const updateEntry = useCallback((id: string, data: Partial<IncomeEntry>) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
      )
    )
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry }
}

export function useDashboardData(
  sources: IncomeSource[],
  entries: IncomeEntry[],
  period: PeriodFilter,
  ownerId?: string
): DashboardData {
  return useMemo(() => {
    const filteredSources = ownerId
      ? sources.filter((s) => s.ownerId === ownerId)
      : sources

    const sourceIds = new Set(filteredSources.map((s) => s.id))

    const filteredEntries = entries.filter(
      (e) =>
        sourceIds.has(e.sourceId) &&
        e.month >= period.startMonth &&
        e.month <= period.endMonth
    )

    const monthsMap = new Map<string, MonthlyAggregation>()

    for (const entry of filteredEntries) {
      const existing = monthsMap.get(entry.month) ?? {
        month: entry.month,
        total: 0,
        sources: {},
      }
      existing.total += entry.amount
      existing.sources[entry.sourceId] =
        (existing.sources[entry.sourceId] ?? 0) + entry.amount
      monthsMap.set(entry.month, existing)
    }

    const months = Array.from(monthsMap.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    )

    const totalIncome = months.reduce((sum, m) => sum + m.total, 0)

    const activeSourcesCount = filteredSources.filter((s) => s.isActive).length

    const sourceTotals = new Map<string, number>()
    for (const entry of filteredEntries) {
      sourceTotals.set(
        entry.sourceId,
        (sourceTotals.get(entry.sourceId) ?? 0) + entry.amount
      )
    }

    let topSourceId = ""
    let topSourceAmount = 0
    for (const [id, amount] of sourceTotals) {
      if (amount > topSourceAmount) {
        topSourceId = id
        topSourceAmount = amount
      }
    }

    const topSourcePercentage =
      totalIncome > 0 ? Math.round((topSourceAmount / totalIncome) * 100) : 0

    return {
      period,
      months,
      totalIncome,
      activeSourcesCount,
      topSourceId,
      topSourcePercentage,
    }
  }, [sources, entries, period, ownerId])
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/hooks/use-income-data.ts
git commit -m "feat: add income data hooks with CRUD and aggregation"
```

---

### Task 6: App Sidebar

**Files:**
- Create: `src/components/app-sidebar.tsx`

**Step 1: Create sidebar component**

```tsx
// src/components/app-sidebar.tsx
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Layers, FileText } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Income Sources", href: "/income-sources", icon: Layers },
  { title: "Income Entries", href: "/income-entries", icon: FileText },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <span className="text-lg font-semibold">Family Income</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/app-sidebar.tsx
git commit -m "feat: add app sidebar with navigation"
```

---

### Task 7: Dashboard Layout + Root Updates

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Modify: `src/app/layout.tsx` (metadata only)
- Replace: `src/app/page.tsx` (redirect to dashboard)

**Step 1: Create dashboard layout**

```tsx
// src/app/(dashboard)/layout.tsx
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

**Step 2: Update root layout metadata**

In `src/app/layout.tsx`, change the metadata:

```typescript
export const metadata: Metadata = {
  title: "Family Income Dashboard",
  description: "Track and diversify your family income sources",
};
```

**Step 3: Replace root page.tsx**

The route group `(dashboard)` makes its `page.tsx` serve at `/`. The root `src/app/page.tsx` must be removed because both would compete for the `/` route.

Delete `src/app/page.tsx` — the `(dashboard)/page.tsx` (Task 12) will handle `/`.

**Step 4: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: May show warning about missing page at `/` — that's OK, Task 12 adds it.

**Step 5: Commit**

```bash
git add src/app/\(dashboard\)/layout.tsx src/app/layout.tsx
git rm src/app/page.tsx
git commit -m "feat: add dashboard layout with sidebar, update metadata"
```

---

### Task 8: Period Selector

**Files:**
- Create: `src/components/period-selector.tsx`

**Step 1: Create period selector**

```tsx
// src/components/period-selector.tsx
"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PeriodFilter } from "@/types/income"
import { getCurrentMonth } from "@/lib/format"

type PeriodSelectorProps = {
  value: PeriodFilter
  onChange: (filter: PeriodFilter) => void
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i)
const QUARTERS = [
  { label: "Q1 (Jan–Mar)", start: "01", end: "03" },
  { label: "Q2 (Apr–Jun)", start: "04", end: "06" },
  { label: "Q3 (Jul–Sep)", start: "07", end: "09" },
  { label: "Q4 (Oct–Dec)", start: "10", end: "12" },
]

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const handleTypeChange = (type: string) => {
    const periodType = type as PeriodFilter["type"]
    const currentMonth = getCurrentMonth()
    const year = currentMonth.split("-")[0]

    switch (periodType) {
      case "monthly":
        onChange({ type: "monthly", startMonth: currentMonth, endMonth: currentMonth })
        break
      case "quarterly": {
        const q = Math.floor((new Date().getMonth()) / 3)
        onChange({
          type: "quarterly",
          startMonth: `${year}-${QUARTERS[q].start}`,
          endMonth: `${year}-${QUARTERS[q].end}`,
        })
        break
      }
      case "yearly":
        onChange({ type: "yearly", startMonth: `${year}-01`, endMonth: `${year}-12` })
        break
      case "custom":
        onChange({ type: "custom", startMonth: value.startMonth, endMonth: value.endMonth })
        break
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Tabs value={value.type} onValueChange={handleTypeChange}>
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        {value.type === "monthly" && (
          <Input
            type="month"
            value={value.startMonth}
            onChange={(e) =>
              onChange({ ...value, startMonth: e.target.value, endMonth: e.target.value })
            }
            className="w-auto"
          />
        )}

        {value.type === "quarterly" && (
          <>
            <Select
              value={value.startMonth.split("-")[0]}
              onValueChange={(year) =>
                onChange({
                  ...value,
                  startMonth: `${year}-${value.startMonth.split("-")[1]}`,
                  endMonth: `${year}-${value.endMonth.split("-")[1]}`,
                })
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={`${value.startMonth.split("-")[1]}-${value.endMonth.split("-")[1]}`}
              onValueChange={(q) => {
                const [start, end] = q.split("-")
                const year = value.startMonth.split("-")[0]
                onChange({ ...value, startMonth: `${year}-${start}`, endMonth: `${year}-${end}` })
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUARTERS.map((q) => (
                  <SelectItem key={q.start} value={`${q.start}-${q.end}`}>
                    {q.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {value.type === "yearly" && (
          <Select
            value={value.startMonth.split("-")[0]}
            onValueChange={(year) =>
              onChange({ ...value, startMonth: `${year}-01`, endMonth: `${year}-12` })
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {value.type === "custom" && (
          <>
            <Input
              type="month"
              value={value.startMonth}
              onChange={(e) => onChange({ ...value, startMonth: e.target.value })}
              className="w-auto"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="month"
              value={value.endMonth}
              onChange={(e) => onChange({ ...value, endMonth: e.target.value })}
              className="w-auto"
            />
          </>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/period-selector.tsx
git commit -m "feat: add period selector component"
```

---

### Task 9: KPI Cards

**Files:**
- Create: `src/components/kpi-cards.tsx`

**Step 1: Create KPI cards**

```tsx
// src/components/kpi-cards.tsx
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
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/kpi-cards.tsx
git commit -m "feat: add KPI cards component"
```

---

### Task 10: Stacked Area Chart

**Files:**
- Create: `src/components/income-area-chart.tsx`

**Step 1: Create area chart**

```tsx
// src/components/income-area-chart.tsx
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
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/income-area-chart.tsx
git commit -m "feat: add stacked area chart component"
```

---

### Task 11: Donut Chart

**Files:**
- Create: `src/components/income-donut-chart.tsx`

**Step 1: Create donut chart**

```tsx
// src/components/income-donut-chart.tsx
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
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/income-donut-chart.tsx
git commit -m "feat: add donut chart component"
```

---

### Task 12: Dashboard Page

**Files:**
- Create: `src/app/(dashboard)/page.tsx`

**Step 1: Create dashboard page**

```tsx
// src/app/(dashboard)/page.tsx
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
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes — all 3 routes now exist (`/`, `/_not-found`).

**Step 3: Verify visually**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run dev`
Open: `http://localhost:3000`
Expected: Sidebar with 3 nav items, KPI cards, stacked area chart, donut chart with mock data.

**Step 4: Commit**

```bash
git add src/app/\(dashboard\)/page.tsx
git commit -m "feat: add dashboard page with KPIs and charts"
```

---

### Task 13: Income Source Form

**Files:**
- Create: `src/components/income-source-form.tsx`

**Step 1: Create form component**

```tsx
// src/components/income-source-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { incomeSourceSchema, type IncomeSourceFormData } from "@/lib/schemas"
import { FAMILY_MEMBERS } from "@/lib/mock-data"
import type { IncomeSource } from "@/types/income"

const DEFAULT_COLORS = [
  "#4f46e5", "#06b6d4", "#f59e0b", "#10b981",
  "#ec4899", "#8b5cf6", "#f97316", "#14b8a6",
]

type IncomeSourceFormProps = {
  source?: IncomeSource
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: IncomeSourceFormData) => void
}

export function IncomeSourceForm({
  source,
  open,
  onOpenChange,
  onSubmit,
}: IncomeSourceFormProps) {
  const form = useForm<IncomeSourceFormData>({
    resolver: zodResolver(incomeSourceSchema),
    defaultValues: {
      name: source?.name ?? "",
      ownerId: source?.ownerId ?? "",
      color: source?.color ?? DEFAULT_COLORS[0],
    },
  })

  const handleSubmit = (data: IncomeSourceFormData) => {
    onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{source ? "Edit Source" : "Add Source"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Freelance React" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FAMILY_MEMBERS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" className="h-10 w-14 p-1" {...field} />
                      <div className="flex gap-1">
                        {DEFAULT_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            className="h-6 w-6 rounded-full border-2 border-transparent hover:border-foreground"
                            style={{ backgroundColor: c }}
                            onClick={() => field.onChange(c)}
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{source ? "Save" : "Add"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/income-source-form.tsx
git commit -m "feat: add income source form dialog"
```

---

### Task 14: Income Sources Table

**Files:**
- Create: `src/components/income-sources-table.tsx`

**Step 1: Create table component**

```tsx
// src/components/income-sources-table.tsx
"use client"

import { MoreHorizontal, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { IncomeSource } from "@/types/income"
import { FAMILY_MEMBERS } from "@/lib/mock-data"

type IncomeSourcesTableProps = {
  sources: IncomeSource[]
  onEdit: (source: IncomeSource) => void
  onDelete: (id: string) => void
  onToggle: (id: string, isActive: boolean) => void
}

export function IncomeSourcesTable({
  sources,
  onEdit,
  onDelete,
  onToggle,
}: IncomeSourcesTableProps) {
  if (sources.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        No income sources yet. Add your first source to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((source) => {
          const owner = FAMILY_MEMBERS.find((m) => m.id === source.ownerId)
          return (
            <TableRow key={source.id}>
              <TableCell>
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
              </TableCell>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell>{owner?.name ?? "Unknown"}</TableCell>
              <TableCell>
                <Badge variant={source.isActive ? "default" : "secondary"}>
                  {source.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(source)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggle(source.id, !source.isActive)}
                    >
                      {source.isActive ? (
                        <>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleRight className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(source.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/income-sources-table.tsx
git commit -m "feat: add income sources table component"
```

---

### Task 15: Income Sources Page

**Files:**
- Create: `src/app/(dashboard)/income-sources/page.tsx`

**Step 1: Create page**

```tsx
// src/app/(dashboard)/income-sources/page.tsx
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IncomeSourcesTable } from "@/components/income-sources-table"
import { IncomeSourceForm } from "@/components/income-source-form"
import { useIncomeSources } from "@/hooks/use-income-data"
import type { IncomeSource } from "@/types/income"
import type { IncomeSourceFormData } from "@/lib/schemas"

export default function IncomeSourcesPage() {
  const { sources, addSource, updateSource, deleteSource } = useIncomeSources()
  const [formOpen, setFormOpen] = useState(false)
  const [editingSource, setEditingSource] = useState<IncomeSource | undefined>()

  const handleAdd = () => {
    setEditingSource(undefined)
    setFormOpen(true)
  }

  const handleEdit = (source: IncomeSource) => {
    setEditingSource(source)
    setFormOpen(true)
  }

  const handleSubmit = (data: IncomeSourceFormData) => {
    if (editingSource) {
      updateSource(editingSource.id, data)
    } else {
      addSource(data)
    }
  }

  const handleToggle = (id: string, isActive: boolean) => {
    updateSource(id, { isActive })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Income Sources</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeSourcesTable
            sources={sources}
            onEdit={handleEdit}
            onDelete={deleteSource}
            onToggle={handleToggle}
          />
        </CardContent>
      </Card>

      <IncomeSourceForm
        source={editingSource}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes, `/income-sources` route appears.

**Step 3: Commit**

```bash
git add src/app/\(dashboard\)/income-sources/page.tsx
git commit -m "feat: add income sources CRUD page"
```

---

### Task 16: Income Entry Form

**Files:**
- Create: `src/components/income-entry-form.tsx`

**Step 1: Create form component**

```tsx
// src/components/income-entry-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { incomeEntrySchema, type IncomeEntryFormData } from "@/lib/schemas"
import { getCurrentMonth } from "@/lib/format"
import type { IncomeEntry, IncomeSource } from "@/types/income"

type IncomeEntryFormProps = {
  entry?: IncomeEntry
  sources: IncomeSource[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: IncomeEntryFormData) => void
}

export function IncomeEntryForm({
  entry,
  sources,
  open,
  onOpenChange,
  onSubmit,
}: IncomeEntryFormProps) {
  const activeSources = sources.filter((s) => s.isActive)

  const form = useForm<IncomeEntryFormData>({
    resolver: zodResolver(incomeEntrySchema),
    defaultValues: {
      sourceId: entry?.sourceId ?? "",
      amount: entry ? entry.amount / 100 : 0,
      month: entry?.month ?? getCurrentMonth(),
      note: entry?.note ?? "",
    },
  })

  const handleSubmit = (data: IncomeEntryFormData) => {
    onSubmit({
      ...data,
      amount: Math.round(data.amount * 100),
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry ? "Edit Entry" : "Add Entry"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeSources.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: s.color }}
                            />
                            {s.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (UAH)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Full salary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{entry ? "Save" : "Add"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/income-entry-form.tsx
git commit -m "feat: add income entry form dialog"
```

---

### Task 17: Income Entries Table

**Files:**
- Create: `src/components/income-entries-table.tsx`

**Step 1: Create table component**

```tsx
// src/components/income-entries-table.tsx
"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { IncomeEntry, IncomeSource } from "@/types/income"
import { formatCurrency, formatMonth } from "@/lib/format"

type IncomeEntriesTableProps = {
  entries: IncomeEntry[]
  sources: IncomeSource[]
  onEdit: (entry: IncomeEntry) => void
  onDelete: (id: string) => void
}

export function IncomeEntriesTable({
  entries,
  sources,
  onEdit,
  onDelete,
}: IncomeEntriesTableProps) {
  const sourceMap = new Map(sources.map((s) => [s.id, s]))

  const sortedEntries = [...entries].sort((a, b) => {
    const monthCmp = b.month.localeCompare(a.month)
    if (monthCmp !== 0) return monthCmp
    return b.amount - a.amount
  })

  if (sortedEntries.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        No income entries for this period.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Source</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedEntries.map((entry) => {
          const source = sourceMap.get(entry.sourceId)
          return (
            <TableRow key={entry.id}>
              <TableCell>{formatMonth(entry.month)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: source?.color ?? "#888" }}
                  />
                  {source?.name ?? "Unknown"}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(entry.amount)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.note || "—"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(entry)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/components/income-entries-table.tsx
git commit -m "feat: add income entries table component"
```

---

### Task 18: Income Entries Page

**Files:**
- Create: `src/app/(dashboard)/income-entries/page.tsx`

**Step 1: Create page**

```tsx
// src/app/(dashboard)/income-entries/page.tsx
"use client"

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PeriodSelector } from "@/components/period-selector"
import { IncomeEntriesTable } from "@/components/income-entries-table"
import { IncomeEntryForm } from "@/components/income-entry-form"
import { useIncomeSources, useIncomeEntries } from "@/hooks/use-income-data"
import { getDefaultPeriodFilter } from "@/lib/format"
import type { PeriodFilter, IncomeEntry } from "@/types/income"
import type { IncomeEntryFormData } from "@/lib/schemas"

export default function IncomeEntriesPage() {
  const { sources } = useIncomeSources()
  const { entries, addEntry, updateEntry, deleteEntry } = useIncomeEntries()
  const [period, setPeriod] = useState<PeriodFilter>(getDefaultPeriodFilter)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<IncomeEntry | undefined>()

  const filteredEntries = useMemo(
    () =>
      entries.filter(
        (e) => e.month >= period.startMonth && e.month <= period.endMonth
      ),
    [entries, period]
  )

  const handleAdd = () => {
    setEditingEntry(undefined)
    setFormOpen(true)
  }

  const handleEdit = (entry: IncomeEntry) => {
    setEditingEntry(entry)
    setFormOpen(true)
  }

  const handleSubmit = (data: IncomeEntryFormData) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, data)
    } else {
      addEntry(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Income Entries</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <PeriodSelector value={period} onChange={setPeriod} />

      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeEntriesTable
            entries={filteredEntries}
            sources={sources}
            onEdit={handleEdit}
            onDelete={deleteEntry}
          />
        </CardContent>
      </Card>

      <IncomeEntryForm
        entry={editingEntry}
        sources={sources}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
```

**Step 2: Verify**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes with all 3 routes: `/`, `/income-sources`, `/income-entries`.

**Step 3: Verify visually**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run dev`
Open: `http://localhost:3000/income-entries`
Expected: Period filter, table with mock entries, add/edit/delete working.

**Step 4: Commit**

```bash
git add src/app/\(dashboard\)/income-entries/page.tsx
git commit -m "feat: add income entries CRUD page"
```

---

### Task 19: Final Build Verification

**Step 1: Full build**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run build`
Expected: Build passes with all routes.

**Step 2: Lint**

Run: `source ~/.nvm/nvm.sh && nvm use && npm run lint`
Expected: No lint errors.

**Step 3: Fix any issues found**

If build or lint fails, fix the errors and re-run.
