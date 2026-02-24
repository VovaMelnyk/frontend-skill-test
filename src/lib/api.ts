const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1"

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`API Error ${status}: ${statusText}`)
    this.name = "ApiError"
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, res.statusText, body)
  }

  if (res.status === 204) return undefined as T

  return res.json()
}

// Income Sources
export function fetchSources() {
  return request<import("@/types/income").IncomeSource[]>("/income-sources")
}

export function createSource(data: { name: string; ownerId: string; color: string }) {
  return request<import("@/types/income").IncomeSource>("/income-sources", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateSource(id: string, data: Record<string, unknown>) {
  return request<import("@/types/income").IncomeSource>(`/income-sources/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteSource(id: string) {
  return request<void>(`/income-sources/${id}`, { method: "DELETE" })
}

// Income Entries
export function fetchEntries(startMonth: string, endMonth: string) {
  return request<import("@/types/income").IncomeEntry[]>(
    `/income-entries?startMonth=${startMonth}&endMonth=${endMonth}`
  )
}

export function createEntry(data: { sourceId: string; amount: number; month: string; note?: string }) {
  return request<import("@/types/income").IncomeEntry>("/income-entries", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateEntry(id: string, data: Record<string, unknown>) {
  return request<import("@/types/income").IncomeEntry>(`/income-entries/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteEntry(id: string) {
  return request<void>(`/income-entries/${id}`, { method: "DELETE" })
}

// Dashboard
export function fetchDashboard(startMonth: string, endMonth: string, ownerId?: string) {
  const params = new URLSearchParams({ startMonth, endMonth })
  if (ownerId) params.set("ownerId", ownerId)
  return request<import("@/types/income").DashboardData>(`/dashboard?${params}`)
}
