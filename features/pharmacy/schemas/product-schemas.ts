import { z } from "zod"

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
})

export const createOrderSchema = z.object({
  deliveryAddress: z.string().min(10, "Please provide a complete delivery address"),
  prescriptionFile: z.any().optional(),
})

export const searchProductSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  requiresPrescription: z.boolean().optional(),
})

export type AddToCartFormData = z.infer<typeof addToCartSchema>
export type CreateOrderFormData = z.infer<typeof createOrderSchema>
export type SearchProductFormData = z.infer<typeof searchProductSchema>
