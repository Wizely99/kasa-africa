import { z } from "zod"

export const healthTipSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(300, "Excerpt must be less than 300 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
})

export const healthTipFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["latest", "popular", "mostLiked", "mostBookmarked"]).optional(),
  tags: z.array(z.string()).optional(),
})

export type HealthTipInput = z.infer<typeof healthTipSchema>
export type HealthTipFiltersInput = z.infer<typeof healthTipFilterSchema>
