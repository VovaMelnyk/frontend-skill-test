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
