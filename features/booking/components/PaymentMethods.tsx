"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Loader2, Phone, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTsh } from "@/utils/CurrencyFormatterHelper";

type PaymentMethod = "CARD" | "MOBILE_MONEY" | "CASH";

type paymentMethodsProps = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  paying: boolean;
  paymentConfirmed: boolean;
  setPaymentConfirmed: (value: boolean) => void;
  handlePay: () => Promise<void>;
  handleCashReserve: () => Promise<void>;
  cardName: string;
  setCardName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCvc: string;
  setCardCvc: (value: string) => void;
  mmNetwork: string;
  setMmNetwork: (value: string) => void;
  mmPhone: string;
  setMmPhone: (value: string) => void;
};

export function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
  setPaymentConfirmed,
  paying,
  paymentConfirmed,
  handlePay,
  handleCashReserve,
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  mmNetwork,
  setMmNetwork,
  mmPhone,
  setMmPhone,
}: paymentMethodsProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <div className="font-medium">Payment Details</div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Consultation Fee:{" "}
          <span className="font-semibold text-foreground">
            {formatTsh(50000)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Payment method</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(v) => {
            setPaymentMethod(v as PaymentMethod);
            setPaymentConfirmed(false);
          }}
          className="grid gap-3 md:grid-cols-3"
        >
          <div className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem value="CARD" id="pm-card" />
            <Label
              htmlFor="pm-card"
              className="flex cursor-pointer items-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> Card
            </Label>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem value="MOBILE_MONEY" id="pm-mm" />
            <Label
              htmlFor="pm-mm"
              className="flex cursor-pointer items-center gap-2"
            >
              <Phone className="h-4 w-4" /> Mobile Money
            </Label>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem value="CASH" id="pm-cash" />
            <Label
              htmlFor="pm-cash"
              className="flex cursor-pointer items-center gap-2"
            >
              Cash at Facility
            </Label>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === "CARD" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="card-name">Name on card</Label>
            <Input
              id="card-name"
              placeholder="Full name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-number">Card number</Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              inputMode="numeric"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="card-exp">Expiry (MM/YY)</Label>
              <Input
                id="card-exp"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-cvc">CVC</Label>
              <Input
                id="card-cvc"
                placeholder="CVC"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                inputMode="numeric"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handlePay}
            disabled={paying || paymentConfirmed}
            className={cn(
              "gap-2",
              paymentConfirmed && "bg-blue-600 hover:bg-blue-600"
            )}
          >
            {paying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {paymentConfirmed ? "Payment confirmed" : "Pay now"}
          </Button>
        </div>
      )}

      {paymentMethod === "MOBILE_MONEY" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="mm-network">Network</Label>
            <Select value={mmNetwork} onValueChange={setMmNetwork}>
              <SelectTrigger id="mm-network">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN">MTN</SelectItem>
                <SelectItem value="Airtel">Airtel</SelectItem>
                <SelectItem value="Vodafone">Vodafone</SelectItem>
                <SelectItem value="Tigo">Tigo</SelectItem>
                <SelectItem value="Halotel">Halotel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mm-phone">Phone number</Label>
            <Input
              id="mm-phone"
              placeholder="+233 20 000 0000"
              value={mmPhone}
              onChange={(e) => setMmPhone(e.target.value)}
            />
          </div>
          <Button
            type="button"
            onClick={handlePay}
            disabled={paying || paymentConfirmed}
            className={cn(
              "gap-2",
              paymentConfirmed && "bg-blue-600 hover:bg-blue-600"
            )}
          >
            {paying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Phone className="h-4 w-4" />
            )}
            {paymentConfirmed ? "Payment confirmed" : "Pay with Mobile Money"}
          </Button>
        </div>
      )}

      {paymentMethod === "CASH" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            You will complete payment at the facility&#39;s front desk before
            your appointment.
          </p>
          <Button
            type="button"
            onClick={handleCashReserve}
            disabled={paying || paymentConfirmed}
            className={cn(
              "gap-2",
              paymentConfirmed && "bg-blue-600 hover:bg-blue-600"
            )}
          >
            {paying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {paymentConfirmed
              ? "Reservation confirmed"
              : "Reserve and pay at facility"}
          </Button>
        </div>
      )}
    </div>
  );
}
