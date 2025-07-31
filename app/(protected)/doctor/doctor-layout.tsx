import { NavigationGroup, SidebarLayout, UserInfo } from "../patient/PatientLayoutClient"
import { Home, Users, FileText, Pill, MessageSquare, BookOpen, Calendar } from "lucide-react"

// Doctor Layout
export function DoctorLayoutClient({ children }: { children: React.ReactNode }) {
  const doctorNavigation: NavigationGroup[] = [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/doctor",
          icon: Home,
        },
      ],
    },
    {
      title: "Schedule",
      items: [
        {
          title: "My Schedule",
          url: "/doctor/schedule",
          icon: Calendar,
        },
        {
          title: "Availability",
          url: "/doctor/slots",
          icon: Calendar,
        },
      ],
    },
    {
      title: "Patient Care",
      items: [
        {
          title: "Patients",
          url: "/doctor/patients",
          icon: Users,
        },
        {
          title: "Medical Records",
          url: "/doctor/records",
          icon: FileText,
        },
        {
          title: "Prescriptions",
          url: "/doctor/prescriptions",
          icon: Pill,
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          title: "Forums",
          url: "/doctor/forums",
          icon: MessageSquare,
        },
        {
          title: "Health Tips",
          url: "/doctor/health-tips",
          icon: BookOpen,
        },
      ],
    },
  ]

  const userInfo: UserInfo = {
    name: "Dr. Sarah Smith",
    email: "dr.smith@kasaafrica.com",
    role: "Doctor",
    initials: "SS",
  }

  return (
    <SidebarLayout
      navigation={doctorNavigation}
      userInfo={userInfo}
      appName="Kasa Africa"
      appSubtitle="Doctor Portal"
      onLogout={() => console.log("Doctor logging out...")}
      onProfileClick={() => console.log("Doctor profile...")}
      onSettingsClick={() => console.log("Doctor settings...")}
    >
      {children}
    </SidebarLayout>
  )
}
