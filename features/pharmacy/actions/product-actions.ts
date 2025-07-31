"use server"

import type { Product, CartItem, Order, CreateOrderRequest } from "../types/product"

// Mock data - replace with actual API calls
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Pain relief and fever reducer",
    price: 12.99,
    category: "Pain Relief",
    inStock: true,
    stockQuantity: 100,
    requiresPrescription: false,
    manufacturer: "PharmaCorp",
    dosage: "500mg",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    description: "Antibiotic for bacterial infections",
    price: 24.99,
    category: "Antibiotics",
    inStock: true,
    stockQuantity: 50,
    requiresPrescription: true,
    manufacturer: "MediLab",
    dosage: "250mg",
  },
  {
    id: "3",
    name: "Vitamin D3 1000IU",
    description: "Vitamin D supplement for bone health",
    price: 18.99,
    category: "Vitamins",
    inStock: true,
    stockQuantity: 75,
    requiresPrescription: false,
    manufacturer: "HealthPlus",
    dosage: "1000IU",
  },
  {
    id: "4",
    name: "Lisinopril 10mg",
    description: "ACE inhibitor for high blood pressure",
    price: 32.99,
    category: "Cardiovascular",
    inStock: true,
    stockQuantity: 30,
    requiresPrescription: true,
    manufacturer: "CardioMed",
    dosage: "10mg",
  },
]

export async function searchProductsAction(query?: string, category?: string, requiresPrescription?: boolean) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredProducts = mockProducts

  if (query) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  }

  if (typeof requiresPrescription === "boolean") {
    filteredProducts = filteredProducts.filter((product) => product.requiresPrescription === requiresPrescription)
  }

  return { success: true, data: filteredProducts }
}

export async function getProductByIdAction(productId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const product = mockProducts.find((p) => p.id === productId)

  if (!product) {
    return { success: false, error: "Product not found" }
  }

  return { success: true, data: product }
}

export async function createOrderAction(orderData: CreateOrderRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const orderItems: CartItem[] = []
  let totalAmount = 0

  for (const item of orderData.items) {
    const product = mockProducts.find((p) => p.id === item.productId)
    if (product) {
      const cartItem: CartItem = {
        productId: item.productId,
        product,
        quantity: item.quantity,
      }
      orderItems.push(cartItem)
      totalAmount += product.price * item.quantity
    }
  }

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    patientId: orderData.patientId,
    items: orderItems,
    totalAmount,
    status: "pending",
    orderDate: new Date().toISOString(),
    deliveryAddress: orderData.deliveryAddress,
    prescriptionUploaded: !!orderData.prescriptionFile,
  }

  return {
    success: true,
    data: newOrder,
    message: "Order placed successfully!",
  }
}

export async function getPatientOrdersAction(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock patient orders
  const orders: Order[] = [
    {
      id: "order-1",
      patientId,
      items: [
        {
          productId: "1",
          product: mockProducts[0],
          quantity: 2,
        },
      ],
      totalAmount: 25.98,
      status: "delivered",
      orderDate: "2024-06-15T10:00:00Z",
      deliveryAddress: "123 Main St, City, State 12345",
    },
  ]

  return { success: true, data: orders }
}
