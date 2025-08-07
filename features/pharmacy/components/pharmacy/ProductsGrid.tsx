import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "./ProductCard";
import { PharmacyProduct } from "../../types";

interface ProductsGridProps {
  products: PharmacyProduct[];
  onAddToCart: (product: PharmacyProduct) => void;
  onViewProduct: (product: PharmacyProduct) => void;
}

export function ProductsGrid({
  products,
  onAddToCart,
  onViewProduct,
}: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No products found. Try adjusting your search criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewProduct={onViewProduct}
        />
      ))}
    </div>
  );
}
