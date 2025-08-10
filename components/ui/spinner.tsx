"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
      "2xl": "h-16 w-16",
    },
    variant: {
      default: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
})

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(({ className, size, variant, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className={cn(spinnerVariants({ size, variant }))} />
    </div>
  )
})
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }
