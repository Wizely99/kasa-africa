export interface PharmacyProduct  {
  reviews?: any
  rating?: any
  discount: any
  featured: any
  originalPrice: any
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
  productId: string;
  product: PharmacyProduct;
  quantity: number;
}

export interface OrderData {
  deliveryAddress: string;
  notes: string;
  paymentMethod: string;
  prescriptionFiles: File[];
}