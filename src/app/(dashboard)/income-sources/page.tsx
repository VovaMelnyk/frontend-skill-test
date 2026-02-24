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
