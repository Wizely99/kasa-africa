"use client"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LoadingPageProps {
  title?: string
  description?: string
  variant?: "default" | "card" | "fullscreen" | "minimal"
  spinnerSize?: "sm" | "default" | "lg" | "xl" | "2xl"
  spinnerVariant?: "default" | "primary" | "secondary" | "destructive" | "white"
  className?: string
}

export function LoadingPage({
  title = "Loading...",
  description,
  variant = "default",
  spinnerSize = "lg",
  spinnerVariant = "primary",
  className,
}: LoadingPageProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Spinner size={spinnerSize} variant={spinnerVariant} />
      {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
      {description && <p className="text-sm text-muted-foreground text-center max-w-md">{description}</p>}
    </div>
  )

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Spinner size={spinnerSize} variant={spinnerVariant} />
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Card className="w-full max-w-md">
          <CardContent className="p-8">{content}</CardContent>
        </Card>
      </div>
    )
  }

  if (variant === "fullscreen") {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
          className,
        )}
      >
        {content}
      </div>
    )
  }

  return <div className={cn("flex items-center justify-center min-h-[400px] p-8", className)}>{content}</div>
}
