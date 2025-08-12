import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "../../types";
import Image from "next/image";

interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartItemsList({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.productId}
          className="flex items-center gap-4 p-4 border rounded-lg"
        >
          <Image
            height={90}
            width={90}
            src={item.product.image || "/placeholder.svg"}
            alt={item.product.name}
            className="w-30 h-30 object-cover rounded"
          />

          <div className="flex-row-2 w-full ">
            <div className="flex-1 ">
              <h4 className="font-medium text-lg">{item.product.name}</h4>
              <p className="text-sm text-muted-foreground">
                {item.product.manufacturer} • {item.product.packSize}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-medium text-lg">
                  ${item.product.price}
                </span>
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
                  onClick={() =>
                    onUpdateQuantity(item.productId, item.quantity - 1)
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() =>
                    onUpdateQuantity(item.productId, item.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="font-bold text-lg">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onRemoveItem(item.productId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
