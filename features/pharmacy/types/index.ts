interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  stockQuantity: number;
  requiresPrescription: boolean;
  manufacturer: string;
  image?: string;
  reviews?: any
  rating?: any
  dosage?: string
  packSize?: string;
  activeIngredient?: string;
  tags?: string[];
}

interface RegularProduct extends BaseProduct {
  discount?: number;
  originalPrice?: number;
  featured?: boolean;
}

interface FeaturedProduct extends BaseProduct {
  discount: number;
  originalPrice: number;
  featured: true;
}

export type PharmacyProduct = RegularProduct | FeaturedProduct;
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


