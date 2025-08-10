import type React from "react"
import type { Metadata } from "next"
import { AdminLayoutClient } from "./AdminLayoutClient"

export const metadata: Metadata = {
  title: "Admin Dashboard - KasaAfrica",
  description: "Admin dashboard for healthcare management system",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
