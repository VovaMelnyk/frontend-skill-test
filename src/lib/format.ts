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
