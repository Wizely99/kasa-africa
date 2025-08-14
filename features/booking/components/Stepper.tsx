"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { id: 1, title: "Select Date & Time" },
  { id: 2, title: "Appointment Details" },
  { id: 3, title: "Payment Details" },
  { id: 4, title: "Confirm Booking" },
] as const;

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex w-full items-center justify-between gap-2">
      {steps.map((step, idx) => {
        const isCompleted = current > step.id;
        const isActive = current === step.id;
        const isLast = idx === steps.length - 1;
        return (
          <li key={step.id} className="flex w-full items-center">
            <div className="flex items-center gap-3">
              <div
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                  isCompleted && "border-blue-500 bg-blue-500 text-white",
                  isActive &&
                    !isCompleted &&
                    "border-blue-600 bg-blue-50 text-blue-700",
                  !isCompleted &&
                    !isActive &&
                    "border-muted-foreground/30 bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium md:inline",
                  isCompleted && "text-blue-600",
                  isActive && "text-foreground",
                  !isCompleted && !isActive && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
            {!isLast && (
              <div
                className="mx-2 hidden h-[2px] flex-1 bg-muted md:block"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
