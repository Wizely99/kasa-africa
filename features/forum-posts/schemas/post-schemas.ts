import { z } from "zod"

export const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z
    .string()
    .min(20, "Excerpt must be at least 20 characters")
    .max(200, "Excerpt must be less than 200 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).min(1, "Please add at least one tag").max(5, "Maximum 5 tags allowed"),
  status: z.enum(["draft", "published"]),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
