export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
  stockQuantity: number
  image?: string
  requiresPrescription: boolean
  manufacturer: string
  dosage?: string
  createdAt: string
  updatedAt: string
  status: "active" | "inactive" | "discontinued"
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  category: string
  stockQuantity: number
  requiresPrescription: boolean
  manufacturer: string
  dosage?: string
  image?: File
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
  status?: "active" | "inactive" | "discontinued"
}

export interface ProductCategory {
  id: string
  name: string
  description: string
}
