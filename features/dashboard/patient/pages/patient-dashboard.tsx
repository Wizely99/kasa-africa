import { CalendarCheck, FileText, Stethoscope } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PatientDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointment</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Dr. Emily Carter</div>
            <p className="text-xs text-muted-foreground">Tomorrow at 2:30 PM</p>
            <Button size="sm" className="mt-2 w-full">
              View Details
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Blood Test Results</div>
            <p className="text-xs text-muted-foreground">Uploaded 2 days ago</p>
            <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent">
              View Records
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Book a New Appointment</CardTitle>
            <CardDescription>Find a doctor and schedule your next visit.</CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/admin/book-appointment?view=patient">
              Find a Doctor
              <Stethoscope className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Need to see a specialist or have a general check-up? Our platform makes it easy to find available doctors
            and book an appointment that fits your schedule.
          </p>
        </CardContent>
      </Card>
    </>
  )
}
