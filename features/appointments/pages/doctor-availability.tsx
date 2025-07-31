"use client"

import { useState } from "react"
import { Plus, Clock, Calendar, Trash2, Edit } from "lucide-react"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Availability Management</h1>
          <p className="text-muted-foreground">Manage your working hours and appointment slots</p>
        </div>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="unavailable">Unavailable Periods</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Weekly Working Hours
              </CardTitle>
              <CardDescription>
                Set your regular working hours and appointment slots for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weeklySchedule.map((day, dayIndex) => (
                  <div key={day.day} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{day.day}</h3>
                        <Badge variant={day.isWorking ? "default" : "secondary"}>
                          {day.isWorking ? "Working Day" : "Day Off"}
                        </Badge>
                      </div>
                      {day.isWorking && (
                        <Dialog
                          open={isAddSlotOpen && selectedDayForSlot === day.day}
                          onOpenChange={(open) => {
                            setIsAddSlotOpen(open)
                            if (!open) resetSlotForm()
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDayForSlot(day.day)
                                setIsAddSlotOpen(true)
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Slot
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Time Slot for {day.day}</DialogTitle>
                              <DialogDescription>Create a new appointment slot for this day</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="start-time">Start Time</Label>
                                  <Input
                                    id="start-time"
                                    type="time"
                                    value={slotStartTime}
                                    onChange={(e) => setSlotStartTime(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="end-time">End Time</Label>
                                  <Input
                                    id="end-time"
                                    type="time"
                                    value={slotEndTime}
                                    onChange={(e) => setSlotEndTime(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="duration">Appointment Duration (minutes)</Label>
                                <Select value={slotDuration} onValueChange={setSlotDuration}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="45">45 minutes</SelectItem>
                                    <SelectItem value="60">60 minutes</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAddSlotOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleAddSlot}>Add Slot</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {day.isWorking && day.slots.length > 0 && (
                      <div className="space-y-2">
                        {day.slots.map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <Badge variant="outline">{slot.duration} min slots</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Dialog
                                open={isEditSlotOpen && currentSlot?.id === slot.id}
                                onOpenChange={(open) => {
                                  setIsEditSlotOpen(open)
                                  if (!open) resetSlotForm()
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentSlot(slot)
                                      setSlotStartTime(slot.startTime)
                                      setSlotEndTime(slot.endTime)
                                      setSlotDuration(String(slot.duration))
                                      setIsEditSlotOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Time Slot</DialogTitle>
                                    <DialogDescription>Modify the details of this appointment slot</DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-start-time">Start Time</Label>
                                        <Input
                                          id="edit-start-time"
                                          type="time"
                                          value={slotStartTime}
                                          onChange={(e) => setSlotStartTime(e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-end-time">End Time</Label>
                                        <Input
                                          id="edit-end-time"
                                          type="time"
                                          value={slotEndTime}
                                          onChange={(e) => setSlotEndTime(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-duration">Appointment Duration (minutes)</Label>
                                      <Select value={slotDuration} onValueChange={setSlotDuration}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="15">15 minutes</SelectItem>
                                          <SelectItem value="30">30 minutes</SelectItem>
                                          <SelectItem value="45">45 minutes</SelectItem>
                                          <SelectItem value="60">60 minutes</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditSlotOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleEditSlot}>Save Changes</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTimeSlot(dayIndex, slot.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {day.isWorking && day.slots.length === 0 && (
                      <p className="text-muted-foreground text-sm">No time slots configured for this day</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view or modify availability</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-none"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Availability for{" "}
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Selected Date"}
                </CardTitle>
                <CardDescription>View and manage slots for the selected date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">09:00 AM - 12:00 PM</p>
                      <p className="text-sm text-muted-foreground">6 available slots</p>
                    </div>
                    <Badge variant="default">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">02:00 PM - 05:00 PM</p>
                      <p className="text-sm text-muted-foreground">4 available slots</p>
                    </div>
                    <Badge variant="default">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="unavailable" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Unavailable Periods
                  </CardTitle>
                  <CardDescription>Manage your vacation days, holidays, and other unavailable periods</CardDescription>
                </div>
                <Dialog
                  open={isAddUnavailableOpen}
                  onOpenChange={(open) => {
                    setIsAddUnavailableOpen(open)
                    if (!open) resetUnavailablePeriodForm()
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Period
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Unavailable Period</DialogTitle>
                      <DialogDescription>
                        Block out dates when you won't be available for appointments
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input
                            id="start-date"
                            type="date"
                            value={unavailableStartDate}
                            onChange={(e) => setUnavailableStartDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date</Label>
                          <Input
                            id="end-date"
                            type="date"
                            value={unavailableEndDate}
                            onChange={(e) => setUnavailableEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={unavailableType}
                          onValueChange={(value) =>
                            setUnavailableType(value as "vacation" | "holiday" | "sick" | "other")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vacation">Vacation</SelectItem>
                            <SelectItem value="holiday">Holiday</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                          id="reason"
                          placeholder="Enter reason for unavailability"
                          value={unavailableReason}
                          onChange={(e) => setUnavailableReason(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUnavailableOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUnavailablePeriod}>Add Period</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unavailablePeriods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {new Date(period.startDate).toLocaleDateString()} -{" "}
                            {new Date(period.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {Math.ceil(
                              (new Date(period.endDate).getTime() - new Date(period.startDate).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}{" "}
                            days
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(period.type)}>
                          {period.type.charAt(0).toUpperCase() + period.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{period.reason}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog
                            open={isEditUnavailableOpen && currentUnavailablePeriod?.id === period.id}
                            onOpenChange={(open) => {
                              setIsEditUnavailableOpen(open)
                              if (!open) resetUnavailablePeriodForm()
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCurrentUnavailablePeriod(period)
                                  setUnavailableStartDate(period.startDate)
                                  setUnavailableEndDate(period.endDate)
                                  setUnavailableType(period.type)
                                  setUnavailableReason(period.reason)
                                  setIsEditUnavailableOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Unavailable Period</DialogTitle>
                                <DialogDescription>Modify the details of this unavailable period</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-start-date">Start Date</Label>
                                    <Input
                                      id="edit-start-date"
                                      type="date"
                                      value={unavailableStartDate}
                                      onChange={(e) => setUnavailableStartDate(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-end-date">End Date</Label>
                                    <Input
                                      id="edit-end-date"
                                      type="date"
                                      value={unavailableEndDate}
                                      onChange={(e) => setUnavailableEndDate(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-type">Type</Label>
                                  <Select
                                    value={unavailableType}
                                    onValueChange={(value) =>
                                      setUnavailableType(value as "vacation" | "holiday" | "sick" | "other")
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="vacation">Vacation</SelectItem>
                                      <SelectItem value="holiday">Holiday</SelectItem>
                                      <SelectItem value="sick">Sick Leave</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-reason">Reason</Label>
                                  <Textarea
                                    id="edit-reason"
                                    placeholder="Enter reason for unavailability"
                                    value={unavailableReason}
                                    onChange={(e) => setUnavailableReason(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditUnavailableOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditUnavailablePeriod}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteUnavailablePeriod(period.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
