"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, AlertCircle, CalendarIcon, FileText, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { bookAppointmentSchema, type BookAppointmentFormData } from "../schemas/appointment-schemas"
import { getDoctorSlotsAction, bookAppointmentAction } from "../actions/appointment-actions"
import type { Doctor, AppointmentSlot } from "../types/appointment"
import { cn } from "@/lib/utils"

interface AppointmentBookingFormProps {
  doctor: Doctor
  onSuccess: (appointment: any) => void
  onCancel: () => void
}

export function AppointmentBookingForm({ doctor, onSuccess, onCancel }: AppointmentBookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const form = useForm<BookAppointmentFormData>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      doctorId: doctor.id,
      type: "consultation",
    },
  })

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return

    setSelectedDate(date)
    setLoading(true)
    setError("")

    try {
      const dateString = date.toISOString().split("T")[0]
      const result = await getDoctorSlotsAction(doctor.id, dateString)
      if (result.success) {
        setAvailableSlots(result.data)
      } else {
        setError("Failed to load available slots")
      }
    } catch (error) {
      console.error("Failed to load slots:", error)
      setError("Failed to load available slots")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BookAppointmentFormData) => {
    setSubmitting(true)
    setError("")

    try {
      const result = await bookAppointmentAction({
        ...data,
        patientId: "current-patient-id", // Replace with actual patient ID
      })

      if (result.success) {
        onSuccess(result.data)
      } else {
        setError(result.error || "Failed to book appointment")
      }
    } catch (error) {
      console.error("Booking failed:", error)
      setError("Failed to book appointment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const selectedSlot = availableSlots.find((slot) => slot.id === form.watch("slotId"))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Doctor Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-primary font-medium">{doctor.specialization}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{doctor.experience} years experience</span>
                <span>•</span>
                <span>Rating: {doctor.rating}/5</span>
                <span>•</span>
                <span className="font-medium text-foreground">${doctor.consultationFee} consultation</span>
              </div>
            </div>
            <Badge variant={doctor.isAvailable ? "default" : "secondary"}>
              {doctor.isAvailable ? "Available" : "Busy"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Schedule Your Appointment
              </CardTitle>
              <CardDescription>Select your preferred date, time, and appointment details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Select Date
                      </h3>
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today || date.getDay() === 0 // Disable past dates and Sundays
                        }}
                        className="rounded-md border w-fit"
                      />
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Available Time Slots
                          {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2"></div>
                          )}
                        </h3>

                        {loading ? (
                          <div className="text-sm text-muted-foreground">Loading available slots...</div>
                        ) : availableSlots.length === 0 ? (
                          <div className="text-sm text-muted-foreground">
                            No available slots for {format(selectedDate, "MMMM d, yyyy")}
                          </div>
                        ) : (
                          <FormField
                            control={form.control}
                            name="slotId"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {availableSlots.map((slot) => (
                                      <div
                                        key={slot.id}
                                        className={cn(
                                          "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50",
                                          field.value === slot.id
                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                            : "border-border",
                                        )}
                                        onClick={() => field.onChange(slot.id)}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">{slot.time}</span>
                                          </div>
                                          <Badge variant="outline">{slot.duration} min</Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">${slot.price}</div>
                                      </div>
                                    ))}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Appointment Details */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Appointment Details
                    </h3>

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Appointment Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select appointment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="consultation">New Consultation</SelectItem>
                              <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                              <SelectItem value="check-up">Regular Check-up</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Visit / Symptoms (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please describe your symptoms, concerns, or reason for this appointment..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                      Back to Doctors
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !form.formState.isValid || !selectedDate || !form.watch("slotId")}
                      className="flex-1"
                    >
                      {submitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Booking...
                        </div>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Doctor:</span>
                  <span className="font-medium">{doctor.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Specialization:</span>
                  <span>{doctor.specialization}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between text-sm">
                    <span>Date:</span>
                    <span className="font-medium">{format(selectedDate, "MMM d, yyyy")}</span>
                  </div>
                )}
                {selectedSlot && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Time:</span>
                      <span className="font-medium">{selectedSlot.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span>{selectedSlot.duration} minutes</span>
                    </div>
                  </>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Consultation Fee:</span>
                  <span>${selectedSlot?.price || doctor.consultationFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee:</span>
                  <span>$5</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${(selectedSlot?.price || doctor.consultationFee) + 5}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <p>• Please arrive 10 minutes before your appointment</p>
              <p>• Bring a valid ID and insurance card</p>
              <p>• You can reschedule up to 24 hours before</p>
              <p>• Cancellation fee may apply for late cancellations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
