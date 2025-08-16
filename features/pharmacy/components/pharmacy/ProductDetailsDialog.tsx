import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus } from "lucide-react";
import { PharmacyProduct } from "../../types";
import Image from "next/image";
import { formatTsh } from "@/utils/CurrencyFormatterHelper";

interface ProductDetailsDialogProps {
  product: PharmacyProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: PharmacyProduct) => void;
  onBuyNow: (product: PharmacyProduct) => void;
}

export function ProductDetailsDialog({
  product,
  open,
  onOpenChange,
  onAddToCart,
  onBuyNow,
}: ProductDetailsDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>Complete product information</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="h-80 w-100 relative">
              <Image
                height={400}
                width={400}
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full h-full rounded-lg"
              />
              {product.discount && (
                <Badge
                  variant={product.discount ? "discount" : "default"}
                  className="absolute top-2 left-2 z-10"
                >
                  -{product.discount}%
                </Badge>
              )}
              {product.featured && (
                <Badge
                  variant={product.featured ? "featured" : "default"}
                  className="absolute top-2 right-2 z-10"
                >
                  Featured
                </Badge>
              )}
              {product.requiresPrescription && (
                <Badge
                  variant={product.requiresPrescription ? "rx" : "default"}
                  className="absolute bottom-0 left-2  z-10"
                >
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
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {product.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground">{product.manufacturer}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                {formatTsh(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatTsh(product.originalPrice)}
                </span>
              )}
              <Badge variant={product.inStock ? "default" : "secondary"}>
                {product.inStock
                  ? `${product.stockQuantity} in stock`
                  : "Out of stock"}
              </Badge>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="font-medium">Active Ingredient:</span>
                <span>{product.activeIngredient}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dosage:</span>
                <span>{product.dosage}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pack Size:</span>
                <span>{product.packSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>{product.category}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                disabled={!product.inStock}
                onClick={() => {
                  onAddToCart(product);
                  onOpenChange(false);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onBuyNow(product);
                  onOpenChange(false);
                }}
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
