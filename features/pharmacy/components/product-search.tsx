"use client"

import { useState } from "react"
import { Search, ShoppingCart, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Product } from "../types/product"
import { searchProductsAction } from "../actions/product-actions"

interface ProductSearchProps {
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductSearch({ onAddToCart }: ProductSearchProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")

  const handleSearch = async () => {
    setLoading(true)
    try {
      const result = await searchProductsAction(query || undefined, category === "all" ? undefined : category)
      if (result.success) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "pain relief", label: "Pain Relief" },
    { value: "antibiotics", label: "Antibiotics" },
    { value: "vitamins", label: "Vitamins" },
    { value: "cardiovascular", label: "Cardiovascular" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
          <CardDescription>Find medicines and healthcare products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search for medicines..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {products.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
                      </div>
                    </div>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">${product.price}</span>
                      {product.dosage && <span className="text-sm text-muted-foreground ml-2">({product.dosage})</span>}
                    </div>
                    {product.requiresPrescription && <Badge variant="outline">Prescription Required</Badge>}
                  </div>

                  <Button className="w-full" onClick={() => onAddToCart(product, 1)} disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No products found. Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
