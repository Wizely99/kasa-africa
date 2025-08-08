"use client"
import { Home, Calendar, Pill, FileText, ShoppingCart, BookOpen, MessageSquare, Users } from "lucide-react"
import { NavigationGroup, SidebarLayout, UserInfo } from "./sidebar-layout"


// Patient Layout
export function PatientLayoutClient({ children }: { children: React.ReactNode }) {
  const patientNavigation: NavigationGroup[] = [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/patient",
          icon: Home,
        },
      ],
    },
    {
      title: "Healthcare",
      items: [
        {
          title: "Book Appointment",
          url: "/patient/book-appointment",
          icon: Calendar,
        },
        {
          title: "My Appointments",
          url: "/patient/appointments",
          icon: Calendar,
        },
        {
          title: "Prescriptions",
          url: "/patient/prescriptions",
          icon: Pill,
        },
        {
          title: "Medical Records",
          url: "/patient/records",
          icon: FileText,
        },
      ],
    },
    {
      title: "Pharmacy",
      items: [
        {
          title: "Browse Products",
          url: "/patient/pharmacy",
          icon: Pill,
        },
        {
          title: "My Orders",
          url: "/patient/orders",
          icon: ShoppingCart,
        },
        {
          title: "Shopping Cart",
          url: "/patient/cart",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          title: "Health Tips",
          url: "/patient/health-tips",
          icon: BookOpen,
        },
        {
          title: "Forums",
          url: "/patient/forums",
          icon: MessageSquare,
        },
        {
          title: "Events",
          url: "/patient/events",
          icon: Calendar,
        },
      ],
    },
    {
      title: "Family",
      items: [
        {
          title: "Family Members",
          url: "/patient/family",
          icon: Users,
        },
      ],
    },
  ]

  const userInfo: UserInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Patient",
    initials: "JD",
    avatarUrl: "/placeholder.svg?height=32&width=32&text=JD"
  }

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...")
  }

  const handleProfileClick = () => {
    // Navigate to profile page
    console.log("Opening profile...")
  }

  const handleSettingsClick = () => {
    // Navigate to settings page
    console.log("Opening settings...")
  }

  return (
    <SidebarLayout
      navigation={patientNavigation}
      userInfo={userInfo}
      appName="Kasa Africa"
      appSubtitle="Patient Portal"
      onLogout={handleLogout}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
    >
      {children}
    </SidebarLayout>
  )
}
