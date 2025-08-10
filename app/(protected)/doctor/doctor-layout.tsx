"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserViewSwitcher } from "@/components/user-view-switcher"
import { cn } from "@/lib/utils"
import { Calendar, Users, FileText, MessageSquare, BookOpen, User, Menu, Stethoscope, Clock } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/doctor",
    icon: Stethoscope,
  },
  {
    name: "Patients",
    href: "/doctor/patients",
    icon: Users,
  },
  {
    name: "Schedule",
    href: "/doctor/schedule",
    icon: Calendar,
  },
  {
    name: "Availability",
    href: "/doctor/availability",
    icon: Clock,
  },
  {
    name: "Prescriptions",
    href: "/doctor/prescriptions",
    icon: FileText,
  },
  {
    name: "Medical Records",
    href: "/doctor/record",
    icon: FileText,
  },
  {
    name: "Forums",
    href: "/doctor/forums",
    icon: MessageSquare,
  },
  {
    name: "Health Tips",
    href: "/doctor/health-tips",
    icon: BookOpen,
  },
  {
    name: "Profile",
    href: "/doctor/profile",
    icon: User,
  },
]

interface DoctorLayoutClientProps {
  children: React.ReactNode
}

const DoctorLayoutClient = ({ children }: DoctorLayoutClientProps) => {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/doctor" className="flex items-center gap-2 font-semibold">
          <Stethoscope className="h-6 w-6" />
          <span>Doctor Portal</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 border-r bg-background lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <h1 className="text-lg font-semibold">Doctor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <UserViewSwitcher />
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default DoctorLayoutClient
