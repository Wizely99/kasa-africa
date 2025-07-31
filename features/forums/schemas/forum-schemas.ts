import { z } from "zod"

export const forumPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
})

export const forumCommentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000, "Comment must be less than 1000 characters"),
  postId: z.string().min(1, "Post ID is required"),
  parentId: z.string().optional(),
})

export const forumFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["latest", "popular", "mostLiked", "mostCommented"]).optional(),
  subscribedOnly: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export type ForumPostInput = z.infer<typeof forumPostSchema>
export type ForumCommentInput = z.infer<typeof forumCommentSchema>
export type ForumFiltersInput = z.infer<typeof forumFilterSchema>
