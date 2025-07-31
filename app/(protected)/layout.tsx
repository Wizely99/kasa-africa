import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for the healthcare management system.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="healthcare-admin-theme">
            {children}
      </ThemeProvider>
    </ErrorBoundary>
  )
}
