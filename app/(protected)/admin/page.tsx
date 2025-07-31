"use client"

import AdminDashboard from "@/features/dashboard/admin/pages/dashboard"
import { Suspense } from "react"


export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  )
}
