"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockAppointments } from "@/features/appointments/data/appointment-data";
import { format, isSameDay } from "date-fns";
import * as React from "react";

export default function MiniCalendar() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  // Get all dates that have appointments
  const datesWithAppointments = React.useMemo(() => {
    return mockAppointments.map((appt) => new Date(appt.appointmentDate));
  }, [mockAppointments]);

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Styles for the modifiers
  const modifiersStyles = {
    selected: {
      backgroundColor: "rgba(0, 123, 255, 1)", // solid blue
      color: "white",
      borderRadius: "50%",
    },
    day: {
      // Base style for all days
      position: "relative" as const,
    },
  };

  // Filter appointments for the selected day
  const appointmentsForDay = selectedDate
    ? mockAppointments.filter((appt) =>
        isSameDay(new Date(appt.appointmentDate), selectedDate)
      )
    : [];

  return (
    <div className="grid md:gap-8 gap-3 grid-cols-1">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            required
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
            disabled={isPastDate}
            modifiers={{
              hasAppointment: datesWithAppointments,
            }}
            modifiersClassNames={{
              hasAppointment: "rdp-day_hasAppointment",
            }}
            modifiersStyles={modifiersStyles}
          />
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card className="p-0">
        <CardHeader className="p-2 w-full">
          <CardTitle className="text-base flex items-center py-1 gap-2 px-4">
            Appointments on{" "}
            <span className="text-blue-500 text-base">
              {format(selectedDate, "yyyy/MM/dd")}
            </span>
          </CardTitle>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="space-y-3 p-0">
          {appointmentsForDay.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No appointments for this day.
            </p>
          ) : (
            appointmentsForDay.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center gap-2  rounded-lg border-0 px-4"
              >
                <Avatar>
                  <AvatarImage src={appt.doctorAvatar} />
                  <AvatarFallback>{appt.doctorName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full p-2">
                  <span className="font-medium">{appt.doctorName}</span>
                  <div className="flex gap-1 justify-between">
                    <span className="text-xs text-muted-foreground">
                      {appt.doctorSpecialization} •{" "}
                      {appt.appointmentType.split("_").join(" ")}
                    </span>
                    <span className="text-xs text-blue-500 font-semibold">
                      {appt.startTime.hour}:
                      {appt.startTime.minute.toString().padStart(2, "0")} -{" "}
                      {appt.endTime.hour}:
                      {appt.endTime.minute.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
