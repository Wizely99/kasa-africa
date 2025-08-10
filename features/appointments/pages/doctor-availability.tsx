"use client"

import React from "react"
import { useState } from "react"
import { Plus, Clock, Calendar, Trash2, Edit } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

  const handleAddSlot = () => {
    if (!slotStartTime || !slotEndTime || !slotDuration || !selectedDayForSlot) return

    const newSlot: TimeSlot = {
      id: String(Date.now()),
      startTime: slotStartTime,
      endTime: slotEndTime,
      duration: Number(slotDuration),
      isAvailable: true,
    }

    setWeeklySchedule((prevSchedule) =>
      prevSchedule.map((day) => (day.day === selectedDayForSlot ? { ...day, slots: [...day.slots, newSlot] } : day)),
    )
    setIsAddSlotOpen(false)
    resetSlotForm()
  }

  const handleEditSlot = () => {
    if (!currentSlot || !slotStartTime || !slotEndTime || !slotDuration) return

    setWeeklySchedule((prevSchedule) =>
      prevSchedule.map((day) => ({
        ...day,
        slots: day.slots.map((slot) =>
          slot.id === currentSlot.id
            ? {
                ...slot,
                startTime: slotStartTime,
                endTime: slotEndTime,
                duration: Number(slotDuration),
              }
            : slot,
        ),
      })),
    )
    setIsEditSlotOpen(false)
    resetSlotForm()
  }

  const handleDeleteTimeSlot = (dayIndex: number, slotId: string) => {
    const updatedSchedule = [...weeklySchedule]
    updatedSchedule[dayIndex].slots = updatedSchedule[dayIndex].slots.filter((slot) => slot.id !== slotId)
    setWeeklySchedule(updatedSchedule)
  }

  const handleAddUnavailablePeriod = () => {
    if (!unavailableStartDate || !unavailableEndDate || !unavailableType || !unavailableReason) return

    const newPeriod: UnavailablePeriod = {
      id: String(Date.now()),
      startDate: unavailableStartDate,
      endDate: unavailableEndDate,
      type: unavailableType,
      reason: unavailableReason,
    }

    setUnavailablePeriods((prev) => [...prev, newPeriod])
    setIsAddUnavailableOpen(false)
    resetUnavailablePeriodForm()
  }

  const handleEditUnavailablePeriod = () => {
    if (
      !currentUnavailablePeriod ||
      !unavailableStartDate ||
      !unavailableEndDate ||
      !unavailableType ||
      !unavailableReason
    )
      return

    setUnavailablePeriods((prev) =>
      prev.map((period) =>
        period.id === currentUnavailablePeriod.id
          ? {
              ...period,
              startDate: unavailableStartDate,
              endDate: unavailableEndDate,
              type: unavailableType,
              reason: unavailableReason,
            }
          : period,
      ),
    )
    setIsEditUnavailableOpen(false)
    resetUnavailablePeriodForm()
  }

  const handleDeleteUnavailablePeriod = (periodId: string) => {
    setUnavailablePeriods((prev) => prev.filter((period) => period.id !== periodId))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "holiday":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "sick":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
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
