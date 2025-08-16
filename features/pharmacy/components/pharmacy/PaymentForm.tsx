// components/checkout/PaymentMethodForm.tsx
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

interface PaymentMethodFormProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
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

  // validation
  const isValid =
    (value === "card" && cardNumber && expiry && cvv) ||
    (value === "google" && mobileNumber) ||
    value === "cod";

  useEffect(() => {
    onValidationChange(!!isValid);
  }, [isValid, onValidationChange]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Payment Method</h3>

      <select
        className="border rounded p-2 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select payment method</option>
        <option value="card">Credit/Debit Card</option>
        <option value="google">Mobile Payment</option>
        <option value="cod">Cash on Delivery</option>
      </select>

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
    </div>
  );
}
