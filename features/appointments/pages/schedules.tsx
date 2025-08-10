"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, Settings } from 'lucide-react'
import ScheduleCalendar from "../components/schedule-calendar"
import PractitionerPricingForm from "../components/practitioner-pricing-form"
import DoctorAvailability from "./doctor-availability"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BulkSlotCreationForm from "@/features/appointments/components/bulk-slot-creation-form"

interface SchedulesPageProps {
  doctorId?: string
}

export default function SchedulesPage({
  doctorId = "3fa85f64-5717-4562-b3fc-2c963f66afa6",
}: SchedulesPageProps) {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Doctor Schedule</h1>
        <p className="text-muted-foreground">
          Create and manage your availability slots.
        </p>
      </div>

      {/* Bulk Slot Creation */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Slot Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <BulkSlotCreationForm
              doctorId={doctorId}
              onSuccess={() => {
                // TODO: revalidate or refetch schedule data after creation
                // This can be hooked into react-query or a server action as needed.
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule & Slots
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Service Pricing
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Availability Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <ScheduleCalendar doctorId={doctorId} />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <PractitionerPricingForm practitionerId={doctorId} />
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <DoctorAvailability />
        </TabsContent>
      </Tabs>
    </div>
  )
}
