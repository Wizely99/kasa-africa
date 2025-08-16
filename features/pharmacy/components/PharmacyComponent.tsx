"use client";

import { useState } from "react";
import { ShoppingCart, Package } from "lucide-react";
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
import { CartItem, OrderData, PharmacyProduct } from "../types";
import { mockProducts, categories } from "../data";
import { SearchFilters } from "../components/pharmacy/PharmacySearchFilters";
import { CartItemsList } from "../components/pharmacy/CartItemsList";
import { ProductDetailsDialog } from "../components/pharmacy/ProductDetailsDialog";
import { OrderSummary } from "../components/pharmacy/OrderSummary";
import { CheckoutDialog } from "../components/pharmacy/CheckoutDialog";
import { ProductCard } from "../components/pharmacy/ProductCard";
import { OrderConfirmationDialog } from "./pharmacy/ConfirmOrderPaymentDialog";
import { formatTsh } from "@/utils/CurrencyFormatterHelper";

export default function PharmacyComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("featured");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<PharmacyProduct | null>(null);
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
        product.tags?.some((tag) =>
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

  const addToCart = (product: PharmacyProduct, quantity = 1) => {
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

  const [showConfirmation, setShowConfirmation] = useState(false);
  const handlePlaceOrder = () => {
    console.log("Placing order:", { items: cartItems, ...orderData });
    setShowConfirmation(true);
    setCartItems([]);
    setShowCheckout(false);
    setOrderData({
      deliveryAddress: "",
      notes: "",
      paymentMethod: "card",
      prescriptionFiles: [],
    });
  };

  const handleViewProduct = (product: PharmacyProduct) => {
    setSelectedProduct(product);
    setShowProductDialog(true);
  };

  const [activeTab, setActiveTab] = useState<"products" | "cart">("products");
  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "products" | "cart")}
        className="space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
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
              Checkout ({formatTsh(getTotalAmount())})
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
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
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

        <TabsContent value="cart" className="space-y-4 ">
          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={() => setActiveTab("products")}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-[2fr_1fr] w-full">
              <div className="">
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
                    <CartItemsList
                      items={cartItems}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <OrderSummary
                  items={cartItems}
                  hasPrescriptionItems={cartItems.some(
                    (item) => item.product.requiresPrescription
                  )}
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
        onBuyNow={(product) => {
          addToCart(product, 1);
          setShowCheckout(true);
          setShowProductDialog(false);
        }}
      />

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        items={cartItems}
        orderData={orderData}
        onOrderDataChange={setOrderData}
        onPlaceOrder={handlePlaceOrder}
        onBackToCart={() => setShowCheckout(false)}
      />
      <OrderConfirmationDialog
        open={showConfirmation}
        onOpenChange={(open) => {
          setShowConfirmation(open);
          if (!open) {
            setTimeout(() => setActiveTab("products"), 300);
            setActiveTab("products"); // Redirect to products tab when closed
          }
        }}
      />
    </div>
  );
}
