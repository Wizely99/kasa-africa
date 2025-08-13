"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type slotButtonProp = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function SlotButton({
  label,
  selected,
  disabled,
  onClick,
}: slotButtonProp) {
  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      className={cn(
        "h-10",
        selected
          ? "bg-emerald-600 hover:bg-emerald-600 text-white"
          : "hover:border-emerald-500 hover:text-emerald-700",
        disabled && "opacity-50 pointer-events-none"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
