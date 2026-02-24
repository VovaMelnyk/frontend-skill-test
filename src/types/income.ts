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
  period: { startMonth: string; endMonth: string }
  months: MonthlyAggregation[]
  totalIncome: number
  activeSourcesCount: number
  topSourceId: string
  topSourcePercentage: number
}
