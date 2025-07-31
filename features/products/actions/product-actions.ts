"use server"

import type { Product, CreateProductRequest, UpdateProductRequest, ProductCategory } from "../types/product"

// Mock data
const mockCategories: ProductCategory[] = [
  { id: "1", name: "Pain Relief", description: "Pain management medications" },
  { id: "2", name: "Antibiotics", description: "Bacterial infection treatments" },
  { id: "3", name: "Vitamins", description: "Nutritional supplements" },
  { id: "4", name: "Cardiovascular", description: "Heart and blood pressure medications" },
  { id: "5", name: "Diabetes", description: "Blood sugar management" },
  { id: "6", name: "Respiratory", description: "Breathing and lung medications" },
]

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description:
      "Effective pain relief and fever reducer. Suitable for headaches, muscle pain, and general discomfort.",
    price: 12.99,
    category: "Pain Relief",
    inStock: true,
    stockQuantity: 150,
    requiresPrescription: false,
    manufacturer: "PharmaCorp",
    dosage: "500mg",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    status: "active",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    description:
      "Broad-spectrum antibiotic for treating various bacterial infections including respiratory tract infections.",
    price: 24.99,
    category: "Antibiotics",
    inStock: true,
    stockQuantity: 75,
    requiresPrescription: true,
    manufacturer: "MediLab",
    dosage: "250mg",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    status: "active",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Vitamin D3 1000IU",
    description: "Essential vitamin D supplement for bone health, immune system support, and overall wellness.",
    price: 18.99,
    category: "Vitamins",
    inStock: true,
    stockQuantity: 200,
    requiresPrescription: false,
    manufacturer: "HealthPlus",
    dosage: "1000IU",
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
    status: "active",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Lisinopril 10mg",
    description: "ACE inhibitor for managing high blood pressure and heart failure. Helps protect kidney function.",
    price: 32.99,
    category: "Cardiovascular",
    inStock: true,
    stockQuantity: 45,
    requiresPrescription: true,
    manufacturer: "CardioMed",
    dosage: "10mg",
    createdAt: "2024-01-05T16:45:00Z",
    updatedAt: "2024-01-05T16:45:00Z",
    status: "active",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Metformin 500mg",
    description: "First-line medication for type 2 diabetes management. Helps control blood sugar levels effectively.",
    price: 28.5,
    category: "Diabetes",
    inStock: false,
    stockQuantity: 0,
    requiresPrescription: true,
    manufacturer: "DiabetesCare",
    dosage: "500mg",
    createdAt: "2024-01-03T11:20:00Z",
    updatedAt: "2024-01-03T11:20:00Z",
    status: "active",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export async function getProductsAction(category?: string, status?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredProducts = mockProducts

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  if (status && status !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.status === status)
  }

  return { success: true, data: filteredProducts }
}

export async function getProductCategoriesAction() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return { success: true, data: mockCategories }
}

export async function createProductAction(data: CreateProductRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newProduct: Product = {
    id: `product-${Date.now()}`,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    inStock: data.stockQuantity > 0,
    stockQuantity: data.stockQuantity,
    requiresPrescription: data.requiresPrescription,
    manufacturer: data.manufacturer,
    dosage: data.dosage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    image: data.image ? "/placeholder.svg?height=200&width=200" : undefined,
  }

  return {
    success: true,
    data: newProduct,
    message: "Product created successfully!",
  }
}

export async function updateProductAction(data: UpdateProductRequest) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const existingProduct = mockProducts.find((p) => p.id === data.id)
  if (!existingProduct) {
    return { success: false, error: "Product not found" }
  }

  const updatedProduct: Product = {
    ...existingProduct,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return {
    success: true,
    data: updatedProduct,
    message: "Product updated successfully!",
  }
}

export async function deleteProductAction(productId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const product = mockProducts.find((p) => p.id === productId)
  if (!product) {
    return { success: false, error: "Product not found" }
  }

  return {
    success: true,
    message: "Product deleted successfully!",
  }
}
