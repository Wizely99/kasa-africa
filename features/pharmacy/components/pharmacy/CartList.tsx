"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Star,
  Package,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "../components/StatsCard";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailsDialog } from "./components/ProductDetailsDialog";
import { CheckoutDialog } from "./components/CheckoutDialog";
import { SearchFilters } from "./components/SearchFilters";
import { CartItem } from "./components/CartItem";
import { OrderSummary } from "./components/OrderSummary";
import {
  Product,
  CartItem as CartItemType,
  OrderData,
} from "./components/types";
import { mockProducts } from "./data/mockProducts";

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
];

export default function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("featured");
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    deliveryAddress: "",
    notes: "",
    paymentMethod: "card",
    prescriptionFiles: [],
  });

  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const getTotalAmount = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    console.log("Placing order:", { items: cartItems, ...orderData });
    alert(
      "Order placed successfully! You will receive a confirmation email shortly."
    );
    setCartItems([]);
    setShowCheckout(false);
    setOrderData({
      deliveryAddress: "",
      notes: "",
      paymentMethod: "card",
      prescriptionFiles: [],
    });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDialog(true);
  };

  // Calculate stats
  const totalProducts = mockProducts.length;
  const totalRevenue = getTotalAmount();
  const averageRating =
    mockProducts.reduce((sum, product) => sum + product.rating, 0) /
    mockProducts.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pharmacy</h1>
        <p className="text-muted-foreground">
          Browse and order medicines and healthcare products
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          description="Available for order"
          icon={Package}
        />
        <StatsCard
          title="Cart Value"
          value={`$${totalRevenue.toFixed(2)}`}
          description={`${getTotalItems()} items in cart`}
          icon={DollarSign}
        />
        <StatsCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          description="Customer satisfaction"
          icon={Star}
        />
        <StatsCard
          title="Featured Products"
          value={mockProducts.filter((p) => p.featured).length}
          description="Recommended items"
          icon={TrendingUp}
        />
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="products">Browse Products</TabsTrigger>
            <TabsTrigger value="cart">
              Cart ({cartItems.length})
              {cartItems.length > 0 && (
                <Badge className="ml-2">{getTotalItems()}</Badge>
              )}
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
              <SearchFilters
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                sortBy={sortBy}
                categories={categories}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortBy}
              />
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onViewProduct={handleViewProduct}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No products found. Try adjusting your search criteria.
                </p>
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
                <Button
                  onClick={() =>
                    document.querySelector('[value="products"]')?.click()
                  }
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Shopping Cart ({getTotalItems()} items)
                    </CardTitle>
                    <CardDescription>
                      Review your items before checkout
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <OrderSummary
                  cartItems={cartItems}
                  totalAmount={getTotalAmount()}
                  onCheckout={() => setShowCheckout(true)}
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        product={selectedProduct}
        open={showProductDialog}
        onOpenChange={setShowProductDialog}
        onAddToCart={addToCart}
        onCheckout={() => {
          if (selectedProduct) {
            addToCart(selectedProduct, 1);
            setShowCheckout(true);
          }
          setShowProductDialog(false);
        }}
      />

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        cartItems={cartItems}
        orderData={orderData}
        totalAmount={getTotalAmount()}
        totalItems={getTotalItems()}
        onOrderDataChange={setOrderData}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
