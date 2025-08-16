import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin } from "lucide-react";
import { mockAppointments } from "@/features/appointments/data/appointment-data";

const AppointmentsList = () => {
  // Map mockAppointments to the format used in the UI
  const mappedAppointments = mockAppointments.map((apt) => {
    const startHour = apt.startTime.hour.toString().padStart(2, "0");
    const startMinute = apt.startTime.minute.toString().padStart(2, "0");
    const durationMinutes =
      (apt.endTime.hour - apt.startTime.hour) * 60 +
      (apt.endTime.minute - apt.startTime.minute);
    const status =
      apt.status === "SCHEDULED" || apt.status === "CONFIRMED"
        ? "upcoming"
        : "completed";

    return {
      id: apt.id,
      doctor: apt.doctorName || "Unknown Doctor",
      specialty: apt.doctorSpecialization || "",
      date: new Date(apt.appointmentDate).toLocaleDateString(),
      time: `${startHour}:${startMinute}`,
      duration: `${durationMinutes} mins`,
      status: status,
      avatar: apt.doctorAvatar || "/placeholder.svg",
      facility: apt.facilityName || "",
      address: apt.facilityAddress || "",
    };
  });

  const upcomingAppointments = mappedAppointments.filter(
    (apt) => apt.status === "upcoming"
  );
  const completedAppointments = mappedAppointments.filter(
    (apt) => apt.status === "completed"
  );

  const renderAppointment = (appointment: (typeof mappedAppointments)[0]) => (
    <Card key={appointment.id} className="p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={appointment.avatar} />
            <AvatarFallback>{appointment.doctor.charAt(3)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-foreground">
              {appointment.doctor}
            </h4>
            <p className="text-sm text-muted-foreground">
              {appointment.specialty}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {appointment.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {appointment.time}
          </div>
          <span className="text-foreground">{appointment.duration}</span>
          <Badge
            variant={
              appointment.status === "upcoming" ? "default" : "secondary"
            }
            className={appointment.status === "upcoming" ? "bg-success" : ""}
          >
            {appointment.status}
          </Badge>
        </div>
      </div>
    </Card>
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Appointments Lists
        </h3>
        <button className="text-primary text-sm hover:underline">
          See All
        </button>
      </div>

      <Tabs defaultValue="future" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="future">Future Appointments</TabsTrigger>
          <TabsTrigger value="history">Appointments History</TabsTrigger>
        </TabsList>
        <TabsContent value="future" className="mt-6">
          {upcomingAppointments.map(renderAppointment)}
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          {completedAppointments.map(renderAppointment)}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AppointmentsList;
