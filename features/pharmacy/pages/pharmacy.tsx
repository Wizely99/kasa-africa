"use client"

import { useState } from "react"
import { Search, ShoppingCart, Plus, Minus, Trash2, Star, Package, DollarSign, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

// Enhanced mock pharmacy products data
const mockProducts = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description:
      "Fast-acting pain relief and fever reducer tablets. Suitable for headaches, muscle pain, and cold symptoms.",
    price: 12.99,
    originalPrice: 15.99,
    category: "Pain Relief",
    inStock: true,
    stockQuantity: 100,
    requiresPrescription: false,
    manufacturer: "PharmaCorp",
    dosage: "500mg",
    image: "/placeholder.svg?height=300&width=300&text=Paracetamol",
    rating: 4.5,
    reviews: 128,
    discount: 19,
    featured: true,
    tags: ["pain relief", "fever", "headache"],
    activeIngredient: "Paracetamol",
    packSize: "20 tablets",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    description: "Broad-spectrum antibiotic for treating bacterial infections including respiratory tract infections.",
    price: 24.99,
    category: "Antibiotics",
    inStock: true,
    stockQuantity: 50,
    requiresPrescription: true,
    manufacturer: "MediLab",
    dosage: "250mg",
    image: "/placeholder.svg?height=300&width=300&text=Amoxicillin",
    rating: 4.7,
    reviews: 89,
    tags: ["antibiotic", "infection", "prescription"],
    activeIngredient: "Amoxicillin",
    packSize: "21 capsules",
  },
  {
    id: "3",
    name: "Vitamin D3 1000IU",
    description: "Essential vitamin D supplement for bone health, immune system support, and calcium absorption.",
    price: 18.99,
    originalPrice: 22.99,
    category: "Vitamins",
    inStock: true,
    stockQuantity: 75,
    requiresPrescription: false,
    manufacturer: "HealthPlus",
    dosage: "1000IU",
    image: "/placeholder.svg?height=300&width=300&text=Vitamin+D3",
    rating: 4.3,
    reviews: 156,
    discount: 17,
    featured: true,
    tags: ["vitamin", "bone health", "immunity"],
    activeIngredient: "Cholecalciferol",
    packSize: "60 tablets",
  },
  {
    id: "4",
    name: "Lisinopril 10mg",
    description: "ACE inhibitor medication for treating high blood pressure and heart failure.",
    price: 32.99,
    category: "Cardiovascular",
    inStock: true,
    stockQuantity: 30,
    requiresPrescription: true,
    manufacturer: "CardioMed",
    dosage: "10mg",
    image: "/placeholder.svg?height=300&width=300&text=Lisinopril",
    rating: 4.6,
    reviews: 67,
    tags: ["blood pressure", "heart", "prescription"],
    activeIngredient: "Lisinopril",
    packSize: "28 tablets",
  },
  {
    id: "5",
    name: "Omega-3 Fish Oil",
    description: "Premium fish oil supplement rich in EPA and DHA for heart and brain health support.",
    price: 29.99,
    originalPrice: 34.99,
    category: "Supplements",
    inStock: true,
    stockQuantity: 120,
    requiresPrescription: false,
    manufacturer: "NutriCare",
    dosage: "1000mg",
    image: "/placeholder.svg?height=300&width=300&text=Omega+3",
    rating: 4.4,
    reviews: 203,
    discount: 14,
    featured: true,
    tags: ["omega-3", "heart health", "brain health"],
    activeIngredient: "EPA/DHA",
    packSize: "90 softgels",
  },
  {
    id: "6",
    name: "Insulin Pen",
    description: "Pre-filled insulin pen for convenient diabetes management with precise dosing.",
    price: 89.99,
    category: "Diabetes Care",
    inStock: true,
    stockQuantity: 25,
    requiresPrescription: true,
    manufacturer: "DiabetesPlus",
    dosage: "100 units/mL",
    image: "/placeholder.svg?height=300&width=300&text=Insulin",
    rating: 4.8,
    reviews: 45,
    tags: ["diabetes", "insulin", "prescription"],
    activeIngredient: "Human Insulin",
    packSize: "3mL pen",
  },
  {
    id: "7",
    name: "Ibuprofen 400mg",
    description: "Anti-inflammatory pain reliever for muscle pain, arthritis, and menstrual cramps.",
    price: 14.99,
    originalPrice: 17.99,
    category: "Pain Relief",
    inStock: true,
    stockQuantity: 85,
    requiresPrescription: false,
    manufacturer: "PainAway",
    dosage: "400mg",
    image: "/placeholder.svg?height=300&width=300&text=Ibuprofen",
    rating: 4.2,
    reviews: 94,
    discount: 17,
    tags: ["pain relief", "anti-inflammatory", "arthritis"],
    activeIngredient: "Ibuprofen",
    packSize: "24 tablets",
  },
  {
    id: "8",
    name: "Multivitamin Complex",
    description: "Complete daily multivitamin with essential vitamins and minerals for overall health.",
    price: 24.99,
    category: "Vitamins",
    inStock: true,
    stockQuantity: 95,
    requiresPrescription: false,
    manufacturer: "VitaLife",
    dosage: "Daily",
    image: "/placeholder.svg?height=300&width=300&text=Multivitamin",
    rating: 4.1,
    reviews: 167,
    featured: true,
    tags: ["multivitamin", "daily health", "minerals"],
    activeIngredient: "Multiple vitamins",
    packSize: "30 tablets",
  },
  {
    id: "9",
    name: "Albuterol Inhaler",
    description: "Fast-acting bronchodilator for asthma and COPD symptom relief.",
    price: 45.99,
    category: "Respiratory",
    inStock: true,
    stockQuantity: 40,
    requiresPrescription: true,
    manufacturer: "BreathEasy",
    dosage: "90mcg",
    image: "/placeholder.svg?height=300&width=300&text=Inhaler",
    rating: 4.7,
    reviews: 78,
    tags: ["asthma", "inhaler", "prescription"],
    activeIngredient: "Albuterol Sulfate",
    packSize: "200 doses",
  },
  {
    id: "10",
    name: "Probiotic Capsules",
    description: "Advanced probiotic formula with 10 billion CFU for digestive and immune health.",
    price: 34.99,
    originalPrice: 39.99,
    category: "Digestive Health",
    inStock: true,
    stockQuantity: 65,
    requiresPrescription: false,
    manufacturer: "GutHealth",
    dosage: "Daily",
    image: "/placeholder.svg?height=300&width=300&text=Probiotics",
    rating: 4.5,
    reviews: 112,
    discount: 13,
    tags: ["probiotics", "digestive health", "immunity"],
    activeIngredient: "Lactobacillus blend",
    packSize: "30 capsules",
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
  "Respiratory",
  "Digestive Health",
]

interface CartItem {
  productId: string
  product: any
  quantity: number
}

interface OrderData {
  deliveryAddress: string
  notes: string
  paymentMethod: string
  prescriptionFiles: File[]
}

export default function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("featured")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [orderData, setOrderData] = useState<OrderData>({
    deliveryAddress: "",
    notes: "",
    paymentMethod: "card",
    prescriptionFiles: [],
  })

  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
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

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const handlePlaceOrder = () => {
    console.log("Placing order:", { items: cartItems, ...orderData })
    alert("Order placed successfully! You will receive a confirmation email shortly.")
    setCartItems([])
    setShowCheckout(false)
    setOrderData({
      deliveryAddress: "",
      notes: "",
      paymentMethod: "card",
      prescriptionFiles: [],
    })
  }

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product)
    setShowProductDialog(true)
  }

  // Calculate stats
  const totalProducts = mockProducts.length
  const totalRevenue = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const averageRating = mockProducts.reduce((sum, product) => sum + product.rating, 0) / mockProducts.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pharmacy</h1>
        <p className="text-muted-foreground">Browse and order medicines and healthcare products</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Available for order</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{getTotalItems()} items in cart</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProducts.filter((p) => p.featured).length}</div>
            <p className="text-xs text-muted-foreground">Recommended items</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="products">Browse Products</TabsTrigger>
            <TabsTrigger value="cart">
              Cart ({cartItems.length}){cartItems.length > 0 && <Badge className="ml-2">{getTotalItems()}</Badge>}
            </TabsTrigger>
          </TabsList>

          {cartItems.length > 0 && (
            <Button onClick={() => setShowCheckout(true)} size="lg">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Checkout (${getTotalAmount().toFixed(2)})
            </Button>
          )}
        </div>

        <TabsContent value="products" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search medicines, supplements, and health products..."
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
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square relative" onClick={() => handleViewProduct(product)}>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {product.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                  )}
                  {product.featured && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                  )}
                  {product.requiresPrescription && (
                    <Badge variant="outline" className="absolute bottom-2 left-2 bg-white">
                      Rx Required
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {product.manufacturer} • {product.packSize}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {product.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={!product.inStock} onClick={() => addToCart(product)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleViewProduct(product)}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No products found. Try adjusting your search criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cart" className="space-y-4">
          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={() => document.querySelector('[value="products"]')?.click()}>Browse Products</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Shopping Cart ({getTotalItems()} items)</CardTitle>
                    <CardDescription>Review your items before checkout</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />

                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.product.manufacturer} • {item.product.packSize}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium text-lg">${item.product.price}</span>
                            {item.product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.product.originalPrice}
                              </span>
                            )}
                            {item.product.requiresPrescription && (
                              <Badge variant="outline" className="text-xs">
                                Rx
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right min-w-[100px]">
                            <p className="font-bold text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal ({getTotalItems()} items)</span>
                        <span>${getTotalAmount().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${(getTotalAmount() * 0.08).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${(getTotalAmount() * 1.08).toFixed(2)}</span>
                      </div>
                    </div>

                    {cartItems.some((item) => item.product.requiresPrescription) && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          ⚠️ Some items require a prescription. You'll need to upload it during checkout.
                        </p>
                      </div>
                    )}

                    <Button onClick={() => setShowCheckout(true)} className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Product Details Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>Complete product information</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="aspect-square relative">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  {selectedProduct.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500">-{selectedProduct.discount}%</Badge>
                  )}
                  {selectedProduct.featured && <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>}
                  {selectedProduct.requiresPrescription && (
                    <Badge variant="outline" className="absolute bottom-2 left-2 bg-white">
                      Rx Required
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{selectedProduct.rating}</span>
                    <span className="text-muted-foreground">({selectedProduct.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground">{selectedProduct.manufacturer}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">${selectedProduct.price}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">${selectedProduct.originalPrice}</span>
                  )}
                  <Badge variant={selectedProduct.inStock ? "default" : "secondary"}>
                    {selectedProduct.inStock ? `${selectedProduct.stockQuantity} in stock` : "Out of stock"}
                  </Badge>
                </div>

                <p className="text-muted-foreground">{selectedProduct.description}</p>

                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Active Ingredient:</span>
                    <span>{selectedProduct.activeIngredient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dosage:</span>
                    <span>{selectedProduct.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Pack Size:</span>
                    <span>{selectedProduct.packSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span>{selectedProduct.category}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    disabled={!selectedProduct.inStock}
                    onClick={() => {
                      addToCart(selectedProduct)
                      setShowProductDialog(false)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToCart(selectedProduct, 1)
                      setShowCheckout(true)
                      setShowProductDialog(false)
                    }}
                    disabled={!selectedProduct.inStock}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your order details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                      </div>
                      <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${getTotalAmount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%)</span>
                    <span>${(getTotalAmount() * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(getTotalAmount() * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Prescription Upload */}
              {cartItems.some((item) => item.product.requiresPrescription) && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Prescription Upload</h3>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                      ⚠️ The following items require a valid prescription:
                    </p>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 list-disc list-inside">
                      {cartItems
                        .filter((item) => item.product.requiresPrescription)
                        .map((item) => (
                          <li key={item.productId}>{item.product.name}</li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <Label htmlFor="prescription">Upload Prescription</Label>
                    <Input id="prescription" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Accepted formats: PDF, JPG, PNG. Maximum 5MB per file.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Delivery Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Delivery Information</h3>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete delivery address including street, city, state, and ZIP code..."
                    value={orderData.deliveryAddress}
                    onChange={(e) => setOrderData((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special delivery instructions, preferred delivery time, etc..."
                    value={orderData.notes}
                    onChange={(e) => setOrderData((prev) => ({ ...prev, notes: e.target.value }))}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Payment Method</h3>
                <Select
                  value={orderData.paymentMethod}
                  onValueChange={(value) => setOrderData((prev) => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="apple">Apple Pay</SelectItem>
                    <SelectItem value="google">Google Pay</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Order Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Estimated delivery: 2-3 business days</li>
                    <li>• Free shipping on orders over $50</li>
                    <li>• Prescription verification required for Rx items</li>
                    <li>• 30-day return policy for unopened items</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setShowCheckout(false)}>
              Back to Cart
            </Button>
            <Button onClick={handlePlaceOrder} disabled={!orderData.deliveryAddress} size="lg">
              Place Order (${(getTotalAmount() * 1.08).toFixed(2)})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
