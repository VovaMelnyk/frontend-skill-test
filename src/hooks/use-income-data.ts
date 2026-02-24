"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as api from "@/lib/api"
import type { IncomeSource, IncomeEntry, PeriodFilter, DashboardData } from "@/types/income"

// ─── Income Sources ───

export function useIncomeSources() {
  const queryClient = useQueryClient()

  const { data: sources = [], isLoading } = useQuery<IncomeSource[]>({
    queryKey: ["income-sources"],
    queryFn: api.fetchSources,
  })

  const addMutation = useMutation({
    mutationFn: (data: { name: string; ownerId: string; color: string }) =>
      api.createSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-sources"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IncomeSource> }) =>
      api.updateSource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-sources"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-sources"] })
      queryClient.invalidateQueries({ queryKey: ["income-entries"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })

  return {
    sources,
    isLoading,
    addSource: (data: { name: string; ownerId: string; color: string }) =>
      addMutation.mutate(data),
    updateSource: (id: string, data: Partial<IncomeSource>) =>
      updateMutation.mutate({ id, data }),
    deleteSource: (id: string) => deleteMutation.mutate(id),
  }
}

// ─── Income Entries ───

export function useIncomeEntries(period: PeriodFilter) {
  const queryClient = useQueryClient()

  const { data: entries = [], isLoading } = useQuery<IncomeEntry[]>({
    queryKey: ["income-entries", period.startMonth, period.endMonth],
    queryFn: () => api.fetchEntries(period.startMonth, period.endMonth),
  })

  const addMutation = useMutation({
    mutationFn: (data: { sourceId: string; amount: number; month: string; note?: string }) =>
      api.createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-entries"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-entries"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-entries"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })

  return {
    entries,
    isLoading,
    addEntry: (data: { sourceId: string; amount: number; month: string; note?: string }) =>
      addMutation.mutate(data),
    updateEntry: (id: string, data: Record<string, unknown>) =>
      updateMutation.mutate({ id, data }),
    deleteEntry: (id: string) => deleteMutation.mutate(id),
  }
}

// ─── Dashboard ───

export function useDashboardData(
  period: PeriodFilter,
  ownerId?: string
): { data: DashboardData | undefined; isLoading: boolean } {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard", period.startMonth, period.endMonth, ownerId],
    queryFn: () => api.fetchDashboard(period.startMonth, period.endMonth, ownerId),
  })

  return { data, isLoading }
}
