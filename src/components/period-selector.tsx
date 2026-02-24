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
