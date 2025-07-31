"use server"

import type { Order, OrderStats } from "../types/order"

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    patientId: "patient-1",
    patientName: "John Smith",
    patientEmail: "john.smith@email.com",
    items: [
      {
        id: "item-1",
        productId: "1",
        productName: "Paracetamol 500mg",
        productImage: "/placeholder.svg?height=100&width=100",
        quantity: 2,
        unitPrice: 12.99,
        totalPrice: 25.98,
      },
      {
        id: "item-2",
        productId: "3",
        productName: "Vitamin D3 1000IU",
        productImage: "/placeholder.svg?height=100&width=100",
        quantity: 1,
        unitPrice: 18.99,
        totalPrice: 18.99,
      },
    ],
    totalAmount: 44.97,
    status: "delivered",
    orderDate: "2024-01-15T10:30:00Z",
    deliveryAddress: "123 Main St, Anytown, ST 12345",
    prescriptionUploaded: false,
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-18T00:00:00Z",
  },
  {
    id: "ORD-002",
    patientId: "patient-2",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.johnson@email.com",
    items: [
      {
        id: "item-3",
        productId: "2",
        productName: "Amoxicillin 250mg",
        productImage: "/placeholder.svg?height=100&width=100",
        quantity: 1,
        unitPrice: 24.99,
        totalPrice: 24.99,
      },
    ],
    totalAmount: 24.99,
    status: "processing",
    orderDate: "2024-01-14T14:20:00Z",
    deliveryAddress: "456 Oak Ave, Another City, ST 67890",
    prescriptionUploaded: true,
    prescriptionVerified: true,
    estimatedDelivery: "2024-01-17T00:00:00Z",
  },
  {
    id: "ORD-003",
    patientId: "patient-3",
    patientName: "Michael Brown",
    patientEmail: "michael.brown@email.com",
    items: [
      {
        id: "item-4",
        productId: "4",
        productName: "Lisinopril 10mg",
        productImage: "/placeholder.svg?height=100&width=100",
        quantity: 1,
        unitPrice: 32.99,
        totalPrice: 32.99,
      },
      {
        id: "item-5",
        productId: "1",
        productName: "Paracetamol 500mg",
        productImage: "/placeholder.svg?height=100&width=100",
        quantity: 3,
        unitPrice: 12.99,
        totalPrice: 38.97,
      },
    ],
    totalAmount: 71.96,
    status: "pending",
    orderDate: "2024-01-13T09:15:00Z",
    deliveryAddress: "789 Pine St, Third Town, ST 13579",
    prescriptionUploaded: true,
    prescriptionVerified: false,
    notes: "Patient requested expedited processing",
  },
]

export async function getOrdersAction(status?: string) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  let filteredOrders = mockOrders

  if (status && status !== "all") {
    filteredOrders = filteredOrders.filter((order) => order.status === status)
  }

  return { success: true, data: filteredOrders }
}

export async function getOrderStatsAction() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const stats: OrderStats = {
    totalOrders: mockOrders.length,
    pendingOrders: mockOrders.filter((o) => o.status === "pending").length,
    completedOrders: mockOrders.filter((o) => o.status === "delivered").length,
    totalRevenue: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    averageOrderValue: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0) / mockOrders.length,
  }

  return { success: true, data: stats }
}

export async function updateOrderStatusAction(orderId: string, status: Order["status"]) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const order = mockOrders.find((o) => o.id === orderId)
  if (!order) {
    return { success: false, error: "Order not found" }
  }

  return {
    success: true,
    message: `Order ${orderId} status updated to ${status}`,
  }
}
