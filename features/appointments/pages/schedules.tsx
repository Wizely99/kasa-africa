"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export default function Schedules() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const appointments = [
    { time: "09:00 AM", patient: "John Doe", type: "Check-up", status: "Confirmed" },
    { time: "10:30 AM", patient: "Jane Smith", type: "Follow-up", status: "Confirmed" },
    { time: "01:00 PM", patient: "Peter Jones", type: "Consultation", status: "Pending" },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold mb-4">My Schedule</h1>
        <Card>
          <CardContent className="p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border-none" />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              Appointments for{" "}
              {date
                ? date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                : "today"}
            </CardTitle>
            <CardDescription>You have {appointments.length} appointments scheduled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appt, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold">
                    {appt.time} - {appt.patient}
                  </p>
                  <p className="text-sm text-muted-foreground">{appt.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={appt.status === "Confirmed" ? "default" : "secondary"}>{appt.status}</Badge>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
