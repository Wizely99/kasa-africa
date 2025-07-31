export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  deliveryAddress: string
  prescriptionUploaded?: boolean
  prescriptionVerified?: boolean
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  averageOrderValue: number
}
