// utils/formatCurrency.ts
export const formatTsh = (amount: number) =>
  new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0, // remove decimals if not needed
  }).format(amount).replace("TSh", "Tsh");
