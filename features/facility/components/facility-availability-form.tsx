"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Building2, Calendar, Plus, Edit } from "lucide-react"
import { toast } from "sonner"
import { createFacilityAvailabilitySchema } from "../schemas/facility-availability-schemas"
import { createFacilityAvailability, updateFacilityAvailability } from "../actions/facility-availability-actions"
import type { Facility, FacilityAvailability, DayOfWeek } from "../types/facility-availability"

type FormData = z.infer<typeof createFacilityAvailabilitySchema>

interface FacilityAvailabilityFormProps {
  facilities: Facility[]
  existingAvailability?: FacilityAvailability
  onSuccess?: () => void
  onCancel?: () => void
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
]

export function FacilityAvailabilityForm({
  facilities,
  existingAvailability,
  onSuccess,
  onCancel,
}: FacilityAvailabilityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(createFacilityAvailabilitySchema),
    defaultValues: {
      facilityId: existingAvailability?.facilityId || "",
      days: existingAvailability?.days || [],
      startTime: existingAvailability?.startTime || { hour: 9, minute: 0, second: 0, nano: 0 },
      endTime: existingAvailability?.endTime || { hour: 17, minute: 0, second: 0, nano: 0 },
    },
  })

  const selectedDays = form.watch("days")

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  }

  const parseTime = (timeString: string) => {
    const [hour, minute] = timeString.split(":").map(Number)
    return { hour, minute, second: 0, nano: 0 }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      let result
      if (existingAvailability) {
        result = await updateFacilityAvailability({
          id: existingAvailability.id,
          ...data,
        })
      } else {
        result = await createFacilityAvailability(data)
      }

      if (result.success) {
        toast.success(
          existingAvailability
            ? "Facility availability updated successfully"
            : "Facility availability created successfully",
        )
        onSuccess?.()
      } else {
        toast.error(result.error || "Failed to save facility availability")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDay = (day: DayOfWeek) => {
    const currentDays = form.getValues("days")
    const newDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day]
    form.setValue("days", newDays)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>{existingAvailability ? "Edit" : "Add"} Facility Availability</CardTitle>
        </div>
        <CardDescription>Set the operating hours for your healthcare facility</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Facility Selection */}
            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Facility *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a facility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{facility.name}</span>
                            <span className="text-sm text-muted-foreground">{facility.type}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Days Selection */}
            <FormField
              control={form.control}
              name="days"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Operating Days *
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.value}
                          checked={selectedDays.includes(day.value)}
                          onCheckedChange={() => toggleDay(day.value)}
                        />
                        <label
                          htmlFor={day.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedDays.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedDays.map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {DAYS_OF_WEEK.find((d) => d.value === day)?.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start Time *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={formatTime(field.value.hour, field.value.minute)}
                        onChange={(e) => {
                          const timeObj = parseTime(e.target.value)
                          field.onChange(timeObj)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      End Time *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={formatTime(field.value.hour, field.value.minute)}
                        onChange={(e) => {
                          const timeObj = parseTime(e.target.value)
                          field.onChange(timeObj)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview */}
            {selectedDays.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Operating Schedule:</p>
                    <p>{selectedDays.map((day) => DAYS_OF_WEEK.find((d) => d.value === day)?.label).join(", ")}</p>
                    <p>
                      {formatTime(form.watch("startTime").hour, form.watch("startTime").minute)} -{" "}
                      {formatTime(form.watch("endTime").hour, form.watch("endTime").minute)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {existingAvailability ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {existingAvailability ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {existingAvailability ? "Update" : "Create"} Availability
                  </>
                )}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
