import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin } from "lucide-react";
import { mockAppointments } from "@/features/appointments/data/appointment-data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AppointmentsList = () => {
  // Map mockAppointments to the format used in the UI
  const mappedAppointments = mockAppointments.map((apt) => {
    const startHour = apt.startTime.hour.toString().padStart(2, "0");
    const startMinute = apt.startTime.minute.toString().padStart(2, "0");
    const durationMinutes =
      (apt.endTime.hour - apt.startTime.hour) * 60 +
      (apt.endTime.minute - apt.startTime.minute);

    // Convert appointment date + time to timestamp
    const appointmentTimestamp = new Date(
      `${apt.appointmentDate}T${startHour}:${startMinute}:00`
    ).getTime();

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
      status,
      avatar: apt.doctorAvatar || "/placeholder.svg",
      facility: apt.facilityName || "",
      address: apt.facilityAddress || "",
      timestamp: appointmentTimestamp,
    };
  });

  // Get upcoming appointments: next 3 soonest
  const upcomingAppointments = mappedAppointments
    .filter((apt) => apt.status === "upcoming")
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(0, 3);

  // Get recently completed appointments: latest first
  const completedAppointments = mappedAppointments
    .filter((apt) => apt.status === "completed")
    .sort((a, b) => b.timestamp - a.timestamp); // newest first

  const renderAppointment = (appointment: (typeof mappedAppointments)[0]) => (
    <Card key={appointment.id} className="p-4 mb-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Avatar + Doctor Info */}
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={appointment.avatar} />
            <AvatarFallback>{appointment.doctor.charAt(0)}</AvatarFallback>
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

        {/* Right: Appointment Info */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground md:gap-6">
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
            className={`${
              appointment.status === "upcoming"
                ? "bg-blue-500 ml-auto"
                : "bg-emerald-500 hover:bg-emerald-600 text-white ml-auto"
            }`}
          >
            {appointment.status}
          </Badge>
        </div>
      </div>
    </Card>
  );

  const router = useRouter();

  const handleClick = () => {
    router.push("/patient/appointments");
  };
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Appointments Lists
        </h3>
        <Button
          className="text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
          onClick={handleClick}
        >
          See All
        </Button>
      </div>

      <Tabs defaultValue="future" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1">
          <TabsTrigger value="future" className="cursor-pointer">
            Future Appointments
          </TabsTrigger>
          <TabsTrigger value="history" className="cursor-pointer">
            Appointments History
          </TabsTrigger>
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
