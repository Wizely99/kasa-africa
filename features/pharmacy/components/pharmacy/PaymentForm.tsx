import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaymentMethodFormProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void; // 👈 tells parent if form is valid
}

export function PaymentMethodForm({
  value,
  onChange,
  onValidationChange,
}: PaymentMethodFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<null | "success" | "failed">(null);

  // validation logic
  const isValid =
    (value === "card" && cardNumber && expiry && cvv) ||
    (value === "google" && mobileNumber) ||
    value === "cod";

  useEffect(() => {
    onValidationChange(!!isValid);
  }, [isValid, onValidationChange]);

  const simulatePayment = () => {
    setIsProcessing(true);
    setStatus(null);

    setTimeout(() => {
      setIsProcessing(false);
      setStatus("success"); // could randomize "failed"
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Payment Method</h3>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="card">Credit/Debit Card</SelectItem>
          <SelectItem value="google">Mobile Payment</SelectItem>
          <SelectItem value="cod">Cash on Delivery</SelectItem>
        </SelectContent>
      </Select>

      {/* Card form */}
      {value === "card" && (
        <div className="space-y-2">
          <Input
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <Input
            placeholder="Expiry Date (MM/YY)"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <Input
            type="password"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
      )}

      {/* Mobile form */}
      {value === "google" && (
        <Input
          placeholder="Mobile Payment Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
      )}

      {value === "cod" && (
        <p className="text-sm text-gray-600">
          You will pay in cash when your order arrives.
        </p>
      )}

      {/* Simulated payment button */}
      {value !== "cod" && (
        <Button
          onClick={simulatePayment}
          disabled={isProcessing || !isValid}
          variant="outline"
        >
          {isProcessing ? "Processing..." : "Simulate Payment"}
        </Button>
      )}

      {/* Status */}
      {status === "success" && (
        <p className="text-green-600 text-sm">✅ Payment Authorized</p>
      )}
      {status === "failed" && (
        <p className="text-red-600 text-sm">❌ Payment Failed</p>
      )}
    </div>
  );
}
