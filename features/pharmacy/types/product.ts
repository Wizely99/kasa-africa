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
}

export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  patientId: string
  items: CartItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  deliveryAddress: string
  prescriptionUploaded?: boolean
}

export interface CreateOrderRequest {
  patientId: string
  items: { productId: string; quantity: number }[]
  deliveryAddress: string
  prescriptionFile?: File
}
