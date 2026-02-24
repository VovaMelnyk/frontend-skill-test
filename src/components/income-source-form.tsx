"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { incomeSourceSchema, type IncomeSourceFormData } from "@/lib/schemas"
import { FAMILY_MEMBERS } from "@/lib/mock-data"
import type { IncomeSource } from "@/types/income"

const DEFAULT_COLORS = [
  "#4f46e5", "#06b6d4", "#f59e0b", "#10b981",
  "#ec4899", "#8b5cf6", "#f97316", "#14b8a6",
]

type IncomeSourceFormProps = {
  source?: IncomeSource
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: IncomeSourceFormData) => void
}

export function IncomeSourceForm({
  source,
  open,
  onOpenChange,
  onSubmit,
}: IncomeSourceFormProps) {
  const form = useForm<IncomeSourceFormData>({
    resolver: zodResolver(incomeSourceSchema),
    defaultValues: {
      name: source?.name ?? "",
      ownerId: source?.ownerId ?? "",
      color: source?.color ?? DEFAULT_COLORS[0],
    },
  })

  const handleSubmit = (data: IncomeSourceFormData) => {
    onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{source ? "Edit Source" : "Add Source"}</DialogTitle>
          <DialogDescription>
            {source ? "Update the income source details below." : "Fill in the details to add a new income source."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Freelance React" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FAMILY_MEMBERS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" className="h-10 w-14 p-1" {...field} />
                      <div className="flex gap-1">
                        {DEFAULT_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            aria-label={`Select color ${c}`}
                            className="h-6 w-6 rounded-full border-2 border-transparent hover:border-foreground"
                            style={{ backgroundColor: c }}
                            onClick={() => field.onChange(c)}
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{source ? "Save" : "Add"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
