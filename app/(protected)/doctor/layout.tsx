
import type { Metadata } from "next"
import type React from "react"
import { DoctorLayoutClient } from "./doctor-layout"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for the healthcare management system.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    
        <DoctorLayoutClient>{children}</DoctorLayoutClient>
  )
}