import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  image: z.string().min(6, "Image URL must be at least 6 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  stockQuantity: z.number().min(0, "Stock quantity cannot be negative"),
  requiresPrescription: z.boolean(),
  manufacturer: z.string().min(2, "Manufacturer name is required"),
  status: z.enum(["active", "inactive", "discontinued"]).optional(),
  dosage: z.string().optional(),
})

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1, "Product ID is required"),
  status: z.enum(["active", "inactive", "discontinued"]).optional(),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>
export type UpdateProductFormData = z.infer<typeof updateProductSchema>
