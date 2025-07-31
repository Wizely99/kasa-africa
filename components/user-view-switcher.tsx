"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCallback } from "react"

export function UserViewSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentView = searchParams?.get("view") || "admin"

  const handleValueChange = useCallback(
    (view: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "")
      params.set("view", view)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <Tabs value={currentView} onValueChange={handleValueChange} className="w-full md:w-auto">
      <TabsList className="grid w-full grid-cols-3 md:w-auto">
        <TabsTrigger value="admin">Admin</TabsTrigger>
        <TabsTrigger value="doctor">Doctor</TabsTrigger>
        <TabsTrigger value="patient">Patient</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
