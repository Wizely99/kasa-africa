"use client"

import React from "react"
import { useState } from "react"
import { Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  duration: number
  isAvailable: boolean
}

interface AvailabilityDay {
  day: string
  isWorking: boolean
  slots: TimeSlot[]
}

interface UnavailablePeriod {
  id: string
  startDate: string
  endDate: string
  reason: string
  type: "vacation" | "holiday" | "sick" | "other"
}

export default function DoctorAvailability() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false)
  const [isEditSlotOpen, setIsEditSlotOpen] = useState(false)
  const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null)
  const [isAddUnavailableOpen, setIsAddUnavailableOpen] = useState(false)
  const [isEditUnavailableOpen, setIsEditUnavailableOpen] = useState(false)
  const [currentUnavailablePeriod, setCurrentUnavailablePeriod] = useState<UnavailablePeriod | null>(null)

  // Form states for Add/Edit Slot
  const [slotStartTime, setSlotStartTime] = useState("")
  const [slotEndTime, setSlotEndTime] = useState("")
  const [slotDuration, setSlotDuration] = useState("30")
  const [selectedDayForSlot, setSelectedDayForSlot] = useState("")

  // Form states for Add/Edit Unavailable Period
  const [unavailableStartDate, setUnavailableStartDate] = useState("")
  const [unavailableEndDate, setUnavailableEndDate] = useState("")
  const [unavailableType, setUnavailableType] = useState<"vacation" | "holiday" | "sick" | "other">("other")
  const [unavailableReason, setUnavailableReason] = useState("")

  // Mock data - replace with actual data fetching
  const [weeklySchedule, setWeeklySchedule] = useState<AvailabilityDay[]>([
    {
      day: "Monday",
      isWorking: true,
      slots: [
        { id: "1", startTime: "09:00", endTime: "12:00", duration: 30, isAvailable: true },
        { id: "2", startTime: "14:00", endTime: "17:00", duration: 30, isAvailable: true },
      ],
    },
    {
      day: "Tuesday",
      isWorking: true,
      slots: [
        { id: "3", startTime: "09:00", endTime: "12:00", duration: 30, isAvailable: true },
        { id: "4", startTime: "14:00", endTime: "17:00", duration: 30, isAvailable: true },
      ],
    },
    {
      day: "Wednesday",
      isWorking: true,
      slots: [{ id: "5", startTime: "09:00", endTime: "12:00", duration: 30, isAvailable: true }],
    },
    {
      day: "Thursday",
      isWorking: true,
      slots: [
        { id: "6", startTime: "09:00", endTime: "12:00", duration: 30, isAvailable: true },
        { id: "7", startTime: "14:00", endTime: "17:00", duration: 30, isAvailable: true },
      ],
    },
    {
      day: "Friday",
      isWorking: true,
      slots: [{ id: "8", startTime: "09:00", endTime: "12:00", duration: 30, isAvailable: true }],
    },
    {
      day: "Saturday",
      isWorking: false,
      slots: [],
    },
    {
      day: "Sunday",
      isWorking: false,
      slots: [],
    },
  ])

  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>([
    {
      id: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-31",
      reason: "Christmas Holiday",
      type: "holiday",
    },
    {
      id: "2",
      startDate: "2024-08-15",
      endDate: "2024-08-25",
      reason: "Summer Vacation",
      type: "vacation",
    },
  ])

  const resetSlotForm = () => {
    setSlotStartTime("")
    setSlotEndTime("")
    setSlotDuration("30")
    setCurrentSlot(null)
  }

  const resetUnavailablePeriodForm = () => {
    setUnavailableStartDate("")
    setUnavailableEndDate("")
    setUnavailableType("other")
    setUnavailableReason("")
    setCurrentUnavailablePeriod(null)
  }








  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Doctor Availability</CardTitle>
          <CardDescription>
            Manage your general availability settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Availability settings coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
