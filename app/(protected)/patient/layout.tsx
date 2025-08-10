import type { Metadata } from "next"
import type React from "react"
import PatientLayoutClient from "./patient-layout"

export const metadata: Metadata = {
  title: "Patient Portal - KasaAfrica",
  description: "Patient healthcare management portal",
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PatientLayoutClient>{children}</PatientLayoutClient>
}
