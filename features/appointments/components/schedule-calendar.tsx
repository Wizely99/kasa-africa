"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDoctorAllSlots } from "@/hooks/use-appointment-slots";
import { format, isSameDay } from "date-fns";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import BulkSlotCreationForm from "./bulk-slot-creation-form";

interface ScheduleCalendarProps {
  doctorId: string;
}

const SLOT_TYPE_COLORS = {
  REGULAR: "bg-blue-100 text-blue-800 border-blue-200",
  CONSULTATION: "bg-green-100 text-green-800 border-green-200",
  FOLLOW_UP: "bg-yellow-100 text-yellow-800 border-yellow-200",
  EMERGENCY: "bg-red-100 text-red-800 border-red-200",
};

export default function ScheduleCalendar({ doctorId }: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: slotsData, isLoading } = useDoctorAllSlots(doctorId);
  const slots = slotsData?.success ? slotsData.data?.data : [];

  // Get slots for selected date
  const selectedDateSlots = slots?.filter((slot) =>
    isSameDay(new Date(slot.slotDate), selectedDate)
  );

  // Get dates that have slots
  const datesWithSlots = slots?.map((slot) => new Date(slot?.slotDate));

  // Calculate statistics
  const totalSlots = slots?.length ?? 0;
  const availableSlots = slots?.filter((slot) => slot.isAvailable).length ?? 0;
  const bookedSlots = totalSlots - availableSlots;
  const utilizationRate =
    totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

  const formatTime = (timeSlot: { hour: number; minute: number }) => {
    return `${timeSlot.hour.toString().padStart(2, "0")}:${timeSlot.minute
      .toString()
      .padStart(2, "0")}`;
  };

  const getSlotTypeLabel = (slotType: string) => {
    switch (slotType) {
      case "REGULAR":
        return "Regular";
      case "CONSULTATION":
        return "Consultation";
      case "FOLLOW_UP":
        return "Follow-up";
      case "EMERGENCY":
        return "Emergency";
      default:
        return slotType;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Slots
                </p>
                <p className="text-2xl font-bold">{totalSlots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Available
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {availableSlots}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Booked
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {bookedSlots}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Utilization
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {utilizationRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Schedule Calendar</CardTitle>
              <CardDescription>
                View and manage your appointment slots
              </CardDescription>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Create Slots
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Appointment Slots</DialogTitle>
                  <DialogDescription>
                    Set up your availability by creating multiple appointment
                    slots
                  </DialogDescription>
                </DialogHeader>
                <BulkSlotCreationForm
                  doctorId={doctorId}
                  onSuccess={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-none"
              modifiers={{
                hasSlots: datesWithSlots,
                today: new Date(),
              }}
              modifiersStyles={{
                hasSlots: {
                  backgroundColor: "rgb(59 130 246 / 0.1)",
                  color: "rgb(59 130 246)",
                  fontWeight: "bold",
                },
                today: {
                  backgroundColor: "rgb(59 130 246)",
                  color: "white",
                  fontWeight: "bold",
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "EEEE, MMMM d")}
            </CardTitle>
            <CardDescription>
              {selectedDateSlots?.length} slot
              {selectedDateSlots?.length !== 1 ? "s" : ""} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDateSlots?.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Clock className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No slots scheduled
                </p>
                <p className="text-xs text-muted-foreground">
                  Create slots to start accepting appointments
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateSlots
                  ?.sort((a, b) => {
                    const timeA = a.startTime.hour * 60 + a.startTime.minute;
                    const timeB = b.startTime.hour * 60 + b.startTime.minute;
                    return timeA - timeB;
                  })
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium font-mono">
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              SLOT_TYPE_COLORS[
                                slot.slotType as keyof typeof SLOT_TYPE_COLORS
                              ]
                            }
                          >
                            {getSlotTypeLabel(slot.slotType)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2   rounded-full ${
                              slot.isAvailable ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {slot.isAvailable ? "Available" : "Booked"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
