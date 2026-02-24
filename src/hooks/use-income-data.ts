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
