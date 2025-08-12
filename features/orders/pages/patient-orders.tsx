"use client";

import { useState } from "react";
import {
  Search,
  Package,
  Truck,
  Eye,
  RotateCcw,
  FileText,
  Download,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  requiresPrescription: boolean;
}

interface Order {
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

const mockOrders: Order[] = [
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

export default function MyOrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const recentOrders = orders.slice(0, 3);
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) =>
    ["confirmed", "processing", "shipped"].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      },
      confirmed: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: FileText,
      },
      processing: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: Package,
      },
      shipped: {
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: Truck,
      },
      delivered: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: Package,
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: Package,
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const downloadInvoice = (orderId: string) => {
    console.log(`Downloading invoice for order: ${orderId}`);
    // Create a mock PDF download
    const link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8,Invoice for order " + orderId;
    link.download = `invoice-${orderId}.pdf`;
    link.click();
  };

  const downloadReceipt = (orderId: string) => {
    console.log(`Downloading receipt for order: ${orderId}`);
    // Create a mock receipt download
    const link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8,Receipt for order " + orderId;
    link.download = `receipt-${orderId}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-600">
            Track your pharmacy orders and download receipts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700">
                  Total Orders
                </CardTitle>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {totalOrders}
              </div>
              <p className="text-xs text-blue-600 mt-1">All time orders</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-amber-700">
                  Active Orders
                </CardTitle>
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Truck className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">
                {activeOrders}
              </div>
              <p className="text-xs text-amber-600 mt-1">In transit</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-emerald-700">
                  Delivered
                </CardTitle>
                <div className="p-2 bg-emerald-200 rounded-lg">
                  <Package className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">
                {deliveredOrders}
              </div>
              <p className="text-xs text-emerald-600 mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {order.id}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items.length} items • $
                          {order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${statusConfig.color} flex items-center gap-1 px-3 py-1 border`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(order.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* All Orders */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div
                    key={order.id}
                    className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold text-lg text-gray-900">
                            {order.id}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.items.length} item
                            {order.items.length > 1 ? "s" : ""} • Total: $
                            {order.totalAmount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.deliveryAddress.split(",")[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Badge
                          className={`${statusConfig.color} flex items-center gap-1 px-3 py-1 border`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl">
                                  Order {order.id}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900">
                                        Order Information
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Order Date:
                                          </span>
                                          <span>
                                            {new Date(
                                              selectedOrder.orderDate
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Status:
                                          </span>
                                          <Badge
                                            className={
                                              getStatusConfig(
                                                selectedOrder.status
                                              ).color
                                            }
                                          >
                                            {selectedOrder.status
                                              .charAt(0)
                                              .toUpperCase() +
                                              selectedOrder.status.slice(1)}
                                          </Badge>
                                        </div>
                                        {selectedOrder.trackingNumber && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">
                                              Tracking:
                                            </span>
                                            <span className="font-mono">
                                              {selectedOrder.trackingNumber}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900">
                                        Delivery Address
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {selectedOrder.deliveryAddress}
                                      </p>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">
                                      Order Items
                                    </h4>
                                    {selectedOrder.items.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                      >
                                        <img
                                          src={
                                            item.productImage ||
                                            "/api/placeholder/50/50"
                                          }
                                          alt={item.productName}
                                          className="h-12 w-12 rounded-lg object-cover bg-white"
                                        />
                                        <div className="flex-1">
                                          <div className="font-medium">
                                            {item.productName}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Qty: {item.quantity} × $
                                            {item.unitPrice.toFixed(2)}
                                          </div>
                                          {item.requiresPrescription && (
                                            <Badge
                                              variant="outline"
                                              className="mt-1 text-xs"
                                            >
                                              <FileText className="h-3 w-3 mr-1" />
                                              Prescription Required
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="font-semibold">
                                          ${item.totalPrice.toFixed(2)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <Separator />

                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Subtotal:</span>
                                      <span>
                                        $
                                        {(
                                          selectedOrder.totalAmount -
                                          selectedOrder.deliveryFee
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Delivery Fee:</span>
                                      <span>
                                        ${selectedOrder.deliveryFee.toFixed(2)}
                                      </span>
                                    </div>
                                    {selectedOrder.discountAmount && (
                                      <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount:</span>
                                        <span>
                                          -$
                                          {selectedOrder.discountAmount.toFixed(
                                            2
                                          )}
                                        </span>
                                      </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-lg">
                                      <span>Total:</span>
                                      <span>
                                        ${selectedOrder.totalAmount.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex gap-3 pt-4">
                                    <Button
                                      onClick={() =>
                                        downloadInvoice(selectedOrder.id)
                                      }
                                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Download Invoice
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        downloadReceipt(selectedOrder.id)
                                      }
                                      className="flex-1"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Download Receipt
                                    </Button>
                                    {selectedOrder.canReorder && (
                                      <Button
                                        variant="outline"
                                        className="flex-1"
                                      >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reorder
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadReceipt(order.id)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          {order.canReorder && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="p-6 bg-gray-50 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600">
                  {searchQuery || selectedStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You haven't placed any orders yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
