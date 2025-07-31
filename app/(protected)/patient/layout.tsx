import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import type React from "react"
import { PatientLayoutClient } from "./patient-layout"
export const metadata: Metadata = {
  title: "Patient Portal - Kasa Africa",
  description: "Patient healthcare management portal",
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="healthcare-admin-theme">
        <PatientLayoutClient>{children}</PatientLayoutClient>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
