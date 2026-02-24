import { z } from "zod"

export const incomeSourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  ownerId: z.string().min(1, "Owner is required"),
  color: z.string().min(1, "Color is required"),
})

export type IncomeSourceFormData = z.infer<typeof incomeSourceSchema>

export const incomeEntrySchema = z.object({
  sourceId: z.string().min(1, "Source is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Invalid month format"),
  note: z.string().optional().default(""),
})

export type IncomeEntryFormData = z.infer<typeof incomeEntrySchema>
