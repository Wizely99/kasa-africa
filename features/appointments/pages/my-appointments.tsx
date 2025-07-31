import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentCard } from "../components/appointment-card"

export default function MyAppointments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">View and manage your scheduled appointments.</p>
        </div>
        <Button>Book New Appointment</Button>
      </div>
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4 space-y-4">
          <AppointmentCard
            doctor="Dr. Emily Carter"
            type="Dermatology"
            date="July 12, 2025"
            time="2:30 PM"
            status="Upcoming"
          />
          <AppointmentCard
            doctor="Dr. Johnathan Reed"
            type="General Check-up"
            date="August 5, 2025"
            time="11:00 AM"
            status="Upcoming"
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4 space-y-4">
          <AppointmentCard
            doctor="Dr. Emily Carter"
            type="Dermatology"
            date="January 20, 2025"
            time="10:00 AM"
            status="Completed"
          />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <p className="text-center text-muted-foreground py-8">No cancelled appointments.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
