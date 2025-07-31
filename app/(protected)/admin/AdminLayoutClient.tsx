"use client"
import { Home, BarChart3, UserPlus, Users, Pill, Archive, ShoppingCart, MessageSquare, BookOpen, Calendar } from "lucide-react"
import { NavigationGroup, SidebarLayout, UserInfo } from "../patient/PatientLayoutClient"

// Admin Layout
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const adminNavigation: NavigationGroup[] = [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: Home,
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          title: "Doctors",
          url: "/admin/doctors",
          icon: UserPlus,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Pharmacy",
      items: [
        {
          title: "Products",
          url: "/admin/pharmacy/products",
          icon: Pill,
        },
        {
          title: "Inventory",
          url: "/admin/pharmacy/inventory",
          icon: Archive,
        },
        {
          title: "Orders",
          url: "/admin/pharmacy/orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: "Content",
      items: [
        {
          title: "Forums",
          url: "/admin/forums",
          icon: MessageSquare,
        },
        {
          title: "Health Tips",
          url: "/admin/health-tips",
          icon: BookOpen,
        },
        {
          title: "Events",
          url: "/admin/events",
          icon: Calendar,
        },
      ],
    },
  ]

  const userInfo: UserInfo = {
    name: "Admin User",
    email: "admin@kasaafrica.com",
    role: "Facility Admin",
    initials: "AU",
  }

  return (
    <SidebarLayout
      navigation={adminNavigation}
      userInfo={userInfo}
      appName="Kasa Africa"
      appSubtitle="Admin Portal"
      onLogout={() => console.log("Admin logging out...")}
      onProfileClick={() => console.log("Admin profile...")}
      onSettingsClick={() => console.log("Admin settings...")}
    >
      {children}
    </SidebarLayout>
  )
}