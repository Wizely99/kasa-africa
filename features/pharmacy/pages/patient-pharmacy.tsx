"use client"

import { useState } from "react"
import { Search, ShoppingCart, Plus, Minus, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock pharmacy products data
const mockProducts = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Pain relief and fever reducer tablets",
    price: 12.99,
    originalPrice: 15.99,
    category: "Pain Relief",
    inStock: true,
    stockQuantity: 100,
    requiresPrescription: false,
    manufacturer: "PharmaCorp",
    dosage: "500mg",
    image: "/placeholder.svg?height=200&width=200&text=Paracetamol",
    rating: 4.5,
    reviews: 128,
    discount: 19,
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
    image: "/placeholder.svg?height=200&width=200&text=Amoxicillin",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "3",
    name: "Vitamin D3 1000IU",
    description: "Vitamin D supplement for bone health",
    price: 18.99,
    originalPrice: 22.99,
    category: "Vitamins",
    inStock: true,
    stockQuantity: 75,
    requiresPrescription: false,
    manufacturer: "HealthPlus",
    dosage: "1000IU",
    image: "/placeholder.svg?height=200&width=200&text=Vitamin+D3",
    rating: 4.3,
    reviews: 156,
    discount: 17,
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
    image: "/placeholder.svg?height=200&width=200&text=Lisinopril",
    rating: 4.6,
    reviews: 67,
  },
  {
    id: "5",
    name: "Omega-3 Fish Oil",
    description: "Heart and brain health supplement",
    price: 29.99,
    originalPrice: 34.99,
    category: "Supplements",
    inStock: true,
    stockQuantity: 120,
    requiresPrescription: false,
    manufacturer: "NutriCare",
    dosage: "1000mg",
    image: "/placeholder.svg?height=200&width=200&text=Omega+3",
    rating: 4.4,
    reviews: 203,
    discount: 14,
  },
  {
    id: "6",
    name: "Insulin Pen",
    description: "Pre-filled insulin pen for diabetes management",
    price: 89.99,
    category: "Diabetes Care",
    inStock: true,
    stockQuantity: 25,
    requiresPrescription: true,
    manufacturer: "DiabetesPlus",
    dosage: "100 units/mL",
    image: "/placeholder.svg?height=200&width=200&text=Insulin",
    rating: 4.8,
    reviews: 45,
  },
]

const categories = [
  "All Categories",
  "Pain Relief",
  "Antibiotics",
  "Vitamins",
  "Supplements",
  "Cardiovascular",
  "Diabetes Care",
]

interface CartItem {
  productId: string
  product: any
  quantity: number
}

export default function PatientPharmacy() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)

  const [orderData, setOrderData] = useState({
    deliveryAddress: "",
    notes: "",
  })

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: any, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { productId: product.id, product, quantity }]
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const getTotalAmount = () => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  const handlePlaceOrder = () => {
    console.log("Placing order:", { items: cartItems, ...orderData })
    alert("Order placed successfully! You will receive a confirmation email shortly.")
    setCartItems([])
    setShowCheckout(false)
    setOrderData({ deliveryAddress: "", notes: "" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pharmacy</h1>
        <p className="text-muted-foreground">Order medicines and healthcare products</p>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="products">Browse Products</TabsTrigger>
            <TabsTrigger value="cart">Cart ({cartItems.length})</TabsTrigger>
          </TabsList>

          {cartItems.length > 0 && (
            <Button onClick={() => setShowCheckout(true)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Checkout (${getTotalAmount().toFixed(2)})
            </Button>
          )}
        </div>

        <TabsContent value="products" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search medicines and products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {product.discount && <Badge className="absolute top-2 left-2 bg-red-500">-{product.discount}%</Badge>}
                  {product.requiresPrescription && (
                    <Badge variant="outline" className="absolute top-2 right-2 bg-white">
                      Rx Required
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {product.manufacturer} • {product.dosage}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
                    </Badge>
                  </div>

                  <Button className="w-full" disabled={!product.inStock} onClick={() => addToCart(product)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cart" className="space-y-4">
          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button className="mt-4" onClick={() => document.querySelector('[value="products"]')?.click()}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart ({cartItems.length} items)</CardTitle>
                <CardDescription>Review your items before checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.product.manufacturer} • {item.product.dosage}
                      </p>
                      <p className="font-medium">${item.product.price} each</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total: ${getTotalAmount().toFixed(2)}</span>
                  </div>

                  <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your order details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${getTotalAmount().toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Delivery Details</h3>
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete delivery address..."
                  value={orderData.deliveryAddress}
                  onChange={(e) => setOrderData((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special delivery instructions..."
                  value={orderData.notes}
                  onChange={(e) => setOrderData((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>

            {/* Prescription Warning */}
            {cartItems.some((item) => item.product.requiresPrescription) && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Some items require a prescription. Please have your prescription ready for verification.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCheckout(false)}>
                Cancel
              </Button>
              <Button onClick={handlePlaceOrder} disabled={!orderData.deliveryAddress}>
                Place Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      y
    </div>
  )
}
