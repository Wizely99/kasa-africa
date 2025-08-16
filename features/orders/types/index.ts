interface OrderItem {
  id: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  requiresPrescription?: boolean;
  productId?: string;
}


export interface Order {
    patientId?:String
  patientName?: string;
  patientEmail?: string;
  id: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  deliveryAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  prescriptionUploaded: boolean;
  prescriptionVerified: boolean;
  notes?: string;
  canCancel: boolean;
  canReorder: boolean;
  deliveryFee: number;
  discountAmount?: number;
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  averageOrderValue: number
}

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-003",
    orderDate: "2024-01-25",
    items: [
      {
        id: "1",
        productName: "Metformin 500mg",
        quantity: 60,
        unitPrice: 25.99,
        totalPrice: 25.99,
        requiresPrescription: true,
      },
      {
        id: "2",
        productName: "Blood Glucose Test Strips",
        quantity: 1,
        unitPrice: 45.5,
        totalPrice: 45.5,
        requiresPrescription: false,
      },
    ],
    totalAmount: 76.49,
    status: "processing",
    deliveryAddress: "123 Main St, Dar es Salaam, Tanzania",
    prescriptionUploaded: true,
    prescriptionVerified: true,
    canCancel: true,
    canReorder: false,
    deliveryFee: 5.0,
    discountAmount: 0,
  },
  {
    id: "ORD-2024-002",
    orderDate: "2024-01-20",
    items: [
      {
        id: "3",
        productName: "Digital Thermometer",
        quantity: 1,
        unitPrice: 29.99,
        totalPrice: 29.99,
        requiresPrescription: false,
      },
    ],
    totalAmount: 34.99,
    status: "delivered",
    deliveryAddress: "123 Main St, Dar es Salaam, Tanzania",
    trackingNumber: "TZA987654321",
    prescriptionUploaded: false,
    prescriptionVerified: false,
    canCancel: false,
    canReorder: true,
    deliveryFee: 5.0,
  },
  {
    id: "ORD-2024-001",
    orderDate: "2024-01-15",
    items: [
      {
        id: "4",
        productName: "Paracetamol 500mg",
        quantity: 30,
        unitPrice: 8.99,
        totalPrice: 8.99,
        requiresPrescription: false,
      },
      {
        id: "5",
        productName: "Vitamin D3 Supplements",
        quantity: 1,
        unitPrice: 19.99,
        totalPrice: 19.99,
        requiresPrescription: false,
      },
    ],
    totalAmount: 33.98,
    status: "delivered",
    deliveryAddress: "123 Main St, Dar es Salaam, Tanzania",
    trackingNumber: "TZA123456789",
    prescriptionUploaded: false,
    prescriptionVerified: false,
    canCancel: false,
    canReorder: true,
    deliveryFee: 5.0,
  },
];