"use client"

import { MoreHorizontal, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { IncomeSource } from "@/types/income"
import { FAMILY_MEMBERS } from "@/lib/mock-data"

type IncomeSourcesTableProps = {
  sources: IncomeSource[]
  onEdit: (source: IncomeSource) => void
  onDelete: (id: string) => void
  onToggle: (id: string, isActive: boolean) => void
}

export function IncomeSourcesTable({
  sources,
  onEdit,
  onDelete,
  onToggle,
}: IncomeSourcesTableProps) {
  if (sources.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        No income sources yet. Add your first source to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((source) => {
          const owner = FAMILY_MEMBERS.find((m) => m.id === source.ownerId)
          return (
            <TableRow key={source.id}>
              <TableCell>
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: source.color }}
                />
              </TableCell>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell>{owner?.name ?? "Unknown"}</TableCell>
              <TableCell>
                <Badge variant={source.isActive ? "default" : "secondary"}>
                  {source.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(source)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggle(source.id, !source.isActive)}
                    >
                      {source.isActive ? (
                        <>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleRight className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(source.id)}
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
