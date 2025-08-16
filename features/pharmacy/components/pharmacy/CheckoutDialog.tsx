import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { CartItem } from "../../types";
import { formatTsh } from "@/utils/CurrencyFormatterHelper";
import { PaymentMethodForm } from "./PaymentForm";
import { useState } from "react";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  orderData: {
    deliveryAddress: string;
    notes: string;
    paymentMethod: string;
    prescriptionFiles: File[];
  };
  onOrderDataChange: (data: {
    deliveryAddress: string;
    notes: string;
    paymentMethod: string;
    prescriptionFiles: File[];
  }) => void;
  onPlaceOrder: () => void;
  onBackToCart: () => void;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  items,
  orderData,
  onOrderDataChange,
  onPlaceOrder,
  onBackToCart,
}: CheckoutDialogProps) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const hasPrescriptionItems = items.some(
    (item) => item.product.requiresPrescription
  );
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl  overflow-y-auto"
        style={{
          height: "85vh",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none",
        }}
      >
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
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center text-sm"
                  >
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
                    <span className="font-medium">
                      {formatTsh(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatTsh(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>{formatTsh(totalAmount * 0.08)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatTsh(totalAmount * 1.08)}</span>
                </div>
              </div>
            </div>

            {/* Prescription Upload */}
            {hasPrescriptionItems && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Prescription Upload</h3>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                    ⚠️ The following items require a valid prescription:
                  </p>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 list-disc list-inside">
                    {items
                      .filter((item) => item.product.requiresPrescription)
                      .map((item) => (
                        <li key={item.productId}>{item.product.name}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <Label htmlFor="prescription">Upload Prescription</Label>
                  <Input
                    id="prescription"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="mt-1"
                    onChange={(e) => {
                      if (e.target.files) {
                        onOrderDataChange({
                          ...orderData,
                          prescriptionFiles: Array.from(e.target.files),
                        });
                      }
                    }}
                  />
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
                  onChange={(e) =>
                    onOrderDataChange({
                      ...orderData,
                      deliveryAddress: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    onOrderDataChange({
                      ...orderData,
                      notes: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            {/* Payment Method */}
            <PaymentMethodForm
              value={orderData.paymentMethod}
              onChange={(value) =>
                onOrderDataChange({ ...orderData, paymentMethod: value })
              }
              onValidationChange={setIsPaymentValid}
            />

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Order Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Estimated delivery: 2-3 business days</li>
                  <li>• Free shipping on orders over {formatTsh(50000)}</li>
                  <li>• Prescription verification required for Rx items</li>
                  <li>• 30-day return policy for unopened items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onBackToCart}>
            Back to Cart
          </Button>
          <Button
            onClick={onPlaceOrder}
            disabled={!orderData.deliveryAddress}
            size="lg"
          >
            Place Order ({formatTsh(totalAmount * 1.08)})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
