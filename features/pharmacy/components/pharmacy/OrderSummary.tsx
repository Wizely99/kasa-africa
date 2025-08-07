import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CartItem } from "../../types";

interface OrderSummaryProps {
  items: CartItem[];
  hasPrescriptionItems: boolean;
  onCheckout: () => void;
}

export function OrderSummary({
  items,
  hasPrescriptionItems,
  onCheckout,
}: OrderSummaryProps) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({totalItems} items)</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (8%)</span>
          <span>${(totalAmount * 0.08).toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${(totalAmount * 1.08).toFixed(2)}</span>
        </div>
      </div>

      {hasPrescriptionItems && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Some items require a prescription. You'll need to upload it
            during checkout.
          </p>
        </div>
      )}

      <Button onClick={onCheckout} className="w-full" size="lg">
        Proceed to Checkout
      </Button>
    </div>
  );
}
