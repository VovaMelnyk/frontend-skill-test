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
