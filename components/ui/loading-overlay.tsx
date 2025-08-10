"use client"

import type * as React from "react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
  spinnerSize?: "sm" | "default" | "lg" | "xl" | "2xl"
  spinnerVariant?: "default" | "primary" | "secondary" | "destructive" | "white"
  className?: string
}

export function LoadingOverlay({
  isLoading,
  children,
  message = "Loading...",
  spinnerSize = "default",
  spinnerVariant = "primary",
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <Spinner size={spinnerSize} variant={spinnerVariant} />
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
