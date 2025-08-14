import { Eye, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";
import { PharmacyProduct } from "../../types";

interface ProductCardProps {
  product: PharmacyProduct;
  onAddToCart: (product: PharmacyProduct) => void;
  onViewProduct: (product: PharmacyProduct) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onViewProduct,
}: ProductCardProps) {
  return (
    <div className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border rounded-lg">
      <div className="h-48 relative" onClick={() => onViewProduct(product)}>
        <Image
          width={400}
          height={450}
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="object-cover w-full h-full"
        />
    
        {product.discount && (
          <Badge
            variant={product.discount ? "discount" : "default"}
            className="absolute top-2 left-2  hover:bg-red-600 z-10"
          >
            -{product.discount}%
          </Badge>
        )}
        {product.featured && (
          <Badge
            variant={product.featured ? "featured" : "default"}
            className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 z-10"
          >
            Featured
          </Badge>
        )}
        {product.requiresPrescription && (
          <Badge
            variant={product.requiresPrescription ? "rx" : "default"}
            className="absolute bottom-0 left-2 bg-white z-10"
          >
            Rx Required
          </Badge>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {product.manufacturer} • {product.packSize}
            </p>
          </div>
          <Badge variant="secondary" className="ml-2">
            {product.category}
          </Badge>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        <p className="text-sm text-muted-foreground truncate  mt-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">${product.price}</span>
            {"originalPrice" in product && product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Badge variant={product.inStock ? "default" : "secondary"}>
            {product.inStock
              ? `${product.stockQuantity} in stock`
              : "Out of stock"}
          </Badge>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1"
            disabled={!product.inStock}
            onClick={() => onAddToCart(product)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onViewProduct(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
