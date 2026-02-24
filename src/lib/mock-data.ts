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
